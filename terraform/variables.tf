variable "aws_region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "The EC2 instance type (t4g.micro for lowest cost ARM architecture)"
  type        = string
  default     = "t4g.micro"
}

variable "public_key" {
  description = "The public SSH key to allow access to the EC2 instance"
  type        = string
}
