variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "vpc_id" {
  description = "ID of the VPC hosting the service"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnets for the Application Load Balancer"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "Private subnets for ECS service tasks"
  type        = list(string)
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for bitcoinrealtoken.org"
  type        = string
}

variable "primary_domain" {
  description = "Primary domain name (e.g. bitcoinrealtoken.org)"
  type        = string
}

variable "forum_domain" {
  description = "Forum subdomain (e.g. forum.bitcoinrealtoken.org)"
  type        = string
}

variable "acm_certificate_arn" {
  description = "Existing ACM certificate ARN (optional)"
  type        = string
  default     = null
}

variable "ecs_execution_role_arn" {
  description = "IAM role ARN for ECS task execution"
  type        = string
}

variable "ecs_task_role_arn" {
  description = "IAM role ARN for the brtserver task"
  type        = string
}

variable "container_image" {
  description = "Container image URI for brtserver"
  type        = string
}

variable "data_path" {
  description = "Optional DATA_PATH env var for external state file"
  type        = string
  default     = ""
}

variable "reload_interval" {
  description = "Reload interval for reserve snapshot"
  type        = string
  default     = "30s"
}

variable "desired_count" {
  description = "Desired ECS task count"
  type        = number
  default     = 2
}

variable "min_count" {
  description = "Minimum ECS task count"
  type        = number
  default     = 2
}

variable "max_count" {
  description = "Maximum ECS task count"
  type        = number
  default     = 6
}

variable "tags" {
  description = "Common tags to apply to resources"
  type        = map(string)
  default     = {}
}
