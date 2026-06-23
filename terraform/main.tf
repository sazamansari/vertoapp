terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 1. VPC and Subnets (Using default for simplicity, but best practice is to define them)
data "aws_vpc" "default" {
  default = true
}

# 2. Security Group
resource "aws_security_group" "verto_sg" {
  name        = "verto-web-sg"
  description = "Allow inbound traffic for Verto app"
  vpc_id      = data.aws_vpc.default.id

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Restrict this to your IP in production
  }

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Custom ports for backend/frontend/AI
  ingress {
    from_port   = 3000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound traffic (Allow all)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "verto-security-group"
  }
}

# 3. Key Pair
resource "aws_key_pair" "deployer" {
  key_name   = "verto-deploy-key"
  public_key = var.public_key
}

# 4. Data source to get latest Amazon Linux 2023 ARM64 AMI
data "aws_ami" "amazon_linux_arm" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-arm64"]
  }
  
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# 5. EC2 Instance
resource "aws_instance" "verto_server" {
  ami           = data.aws_ami.amazon_linux_arm.id
  instance_type = var.instance_type
  key_name      = aws_key_pair.deployer.key_name

  vpc_security_group_ids = [aws_security_group.verto_sg.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = file("${path.module}/userdata.sh")

  tags = {
    Name = "Verto-Production-Server"
  }
}

# 6. Elastic IP (Optional but recommended so IP doesn't change on reboot)
resource "aws_eip" "verto_eip" {
  instance = aws_instance.verto_server.id
  domain   = "vpc"

  tags = {
    Name = "verto-eip"
  }
}
