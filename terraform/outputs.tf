output "instance_ip" {
  description = "The public IP address of the Verto Server"
  value       = aws_eip.verto_eip.public_ip
}

output "ssh_command" {
  description = "Command to SSH into the server"
  value       = "ssh -i ~/.ssh/id_rsa ec2-user@${aws_eip.verto_eip.public_ip}"
}
