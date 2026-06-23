#!/bin/bash
set -e

# Log output to a file for debugging
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting Verto provisioning script for Amazon Linux 2023..."

# 1. Setup Swap Space (CRITICAL for small instances to prevent npm crashes)
if [ ! -f /swapfile ]; then
    echo "Creating 2GB swap file..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
fi

# 2. Update and Install System Dependencies
dnf update -y
dnf install -y git unzip gcc gcc-c++ make nginx python3 python3-pip

# 3. Install Node.js (v20)
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# 4. Install PM2 (Process Manager for Node.js)
npm install -g pm2
pm2 startup systemd -u ec2-user --hp /home/ec2-user
env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

# 5. Create Verto App Directory
mkdir -p /home/ec2-user/verto
chown -R ec2-user:ec2-user /home/ec2-user/verto

echo "Provisioning complete. Server is ready for Verto deployment."
