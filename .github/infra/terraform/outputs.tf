output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.this.dns_name
}

output "service_security_group_id" {
  description = "Security group ID assigned to ECS tasks"
  value       = aws_security_group.service.id
}

output "route53_primary_record" {
  description = "Primary domain record name"
  value       = aws_route53_record.primary.fqdn
}

output "route53_forum_record" {
  description = "Forum domain record name"
  value       = aws_route53_record.forum.fqdn
}
