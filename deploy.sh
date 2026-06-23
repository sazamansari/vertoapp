#!/bin/bash
set -e

echo "🚀 Starting AWS EC2 Deployment via Terraform..."

# Check if public key exists
if [ ! -f ~/.ssh/id_rsa.pub ]; then
    echo "⚠️ No SSH key found at ~/.ssh/id_rsa.pub!"
    echo "Generating a new SSH key..."
    ssh-keygen -t rsa -b 4096 -N "" -f ~/.ssh/id_rsa
fi

PUBLIC_KEY=$(cat ~/.ssh/id_rsa.pub)

cd terraform

echo "📦 Initializing Terraform..."
terraform init

echo "🔍 Planning Infrastructure..."
terraform plan -var="public_key=$PUBLIC_KEY"

echo "⚡ Deploying to AWS (ap-south-1)..."
terraform apply -var="public_key=$PUBLIC_KEY" -auto-approve

echo "✅ Deployment Complete!"
terraform output
