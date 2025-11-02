terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.65"
    }
  }
}

provider "aws" {
  region = var.region
}

locals {
  app_name        = "brtserver"
  tags            = merge(var.tags, { "Project" = "BitcoinRealToken" })
  listener_port   = 443
  backend_port    = 8080
  health_path     = "/healthz"
  certificate_arn = var.acm_certificate_arn != null ? var.acm_certificate_arn : aws_acm_certificate.brt_cert[0].arn
}

resource "aws_acm_certificate" "brt_cert" {
  count             = var.acm_certificate_arn == null ? 1 : 0
  domain_name       = var.primary_domain
  validation_method = "DNS"

  subject_alternative_names = [
    "${var.primary_domain}",
    var.forum_domain,
  ]

  lifecycle {
    create_before_destroy = true
  }

  tags = local.tags
}

resource "aws_route53_record" "cert_validation" {
  for_each = var.acm_certificate_arn == null ? {
    for dvo in aws_acm_certificate.brt_cert[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  } : {}

  zone_id = var.hosted_zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]
}

resource "aws_acm_certificate_validation" "brt_cert" {
  count                   = var.acm_certificate_arn == null ? 1 : 0
  certificate_arn         = aws_acm_certificate.brt_cert[0].arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

resource "aws_security_group" "alb" {
  name        = "${local.app_name}-alb"
  description = "Allow HTTPS inbound to ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = local.listener_port
    to_port         = local.listener_port
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = local.tags
}

resource "aws_security_group" "service" {
  name        = "${local.app_name}-svc"
  description = "Allow traffic from ALB to service"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = local.backend_port
    to_port         = local.backend_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = local.tags
}

resource "aws_lb" "this" {
  name               = "${local.app_name}-alb"
  load_balancer_type = "application"
  subnets            = var.public_subnet_ids
  security_groups    = [aws_security_group.alb.id]

  tags = local.tags
}

resource "aws_lb_target_group" "this" {
  name        = "${local.app_name}-tg"
  port        = local.backend_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    interval            = 15
    path                = local.health_path
    matcher             = "200"
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = local.tags
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.this.arn
  port              = local.listener_port
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = local.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}

resource "aws_ecs_cluster" "this" {
  name = "${local.app_name}-cluster"
  tags = local.tags
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/ecs/${local.app_name}"
  retention_in_days = 30
  tags              = local.tags
}

resource "aws_ecs_task_definition" "this" {
  family                   = local.app_name
  cpu                      = 512
  memory                   = 1024
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = var.ecs_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  container_definitions = jsonencode([
    {
      name      = local.app_name
      image     = var.container_image
      essential = true
      portMappings = [
        {
          containerPort = local.backend_port
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "LISTEN_ADDR"
          value = ":${local.backend_port}"
        },
        {
          name  = "DATA_PATH"
          value = var.data_path
        },
        {
          name  = "RELOAD_INTERVAL"
          value = var.reload_interval
        }
      ]
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${local.backend_port}${local.health_path} || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 10
      }
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.this.name
          awslogs-region        = var.region
          awslogs-stream-prefix = local.app_name
        }
      }
    }
  ])

  tags = local.tags
}

resource "aws_ecs_service" "this" {
  name            = local.app_name
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [aws_security_group.service.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = local.app_name
    container_port   = local.backend_port
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  tags = local.tags
}

resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = var.max_count
  min_capacity       = var.min_count
  resource_id        = "service/${aws_ecs_cluster.this.name}/${aws_ecs_service.this.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "cpu" {
  name               = "${local.app_name}-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value       = 55
    scale_in_cooldown  = 60
    scale_out_cooldown = 60

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}

resource "aws_route53_record" "primary" {
  zone_id = var.hosted_zone_id
  name    = var.primary_domain
  type    = "A"

  alias {
    name                   = aws_lb.this.dns_name
    zone_id                = aws_lb.this.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "forum" {
  zone_id = var.hosted_zone_id
  name    = var.forum_domain
  type    = "A"

  alias {
    name                   = aws_lb.this.dns_name
    zone_id                = aws_lb.this.zone_id
    evaluate_target_health = true
  }
}
