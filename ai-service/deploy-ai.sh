#!/bin/bash
# Verto AI Flow EC2 Deployment Script
# Usage: ./deploy-ai.sh [EC2_PUBLIC_IP]

set -e

EC2_IP=${1:-"13.206.132.18"}
SSH_KEY="~/.ssh/id_rsa"
REMOTE_USER="ec2-user"
REMOTE_PATH="/home/ec2-user/verto/ai-service"

echo "=========================================================="
echo "🚀 Deploying Vetro AI Flow Service to AWS EC2: $EC2_IP"
echo "=========================================================="

# 1. Ensure remote directory exists
echo "📁 Creating remote application directories..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no ${REMOTE_USER}@${EC2_IP} "mkdir -p ${REMOTE_PATH}"

# 2. Sync files to EC2
echo "📤 Syncing AI service codebase files..."
rsync -avz -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
    --exclude="venv" \
    --exclude="__pycache__" \
    --exclude=".env" \
    --exclude=".git" \
    ./main.py ./requirements.txt \
    ${REMOTE_USER}@${EC2_IP}:${REMOTE_PATH}/

# 3. Setup Environment variables on Remote
echo "⚙️  Configuring remote environment variables..."
# Copy the MongoDB URI and key properties from local backend/.env
MONGODB_URI=$(grep -E "^MONGODB_URI=" ../backend/.env | cut -d'=' -f2-)
ssh -i $SSH_KEY -o StrictHostKeyChecking=no ${REMOTE_USER}@${EC2_IP} "echo 'MONGODB_URI=$MONGODB_URI' > ${REMOTE_PATH}/.env"

# 4. Provision remote Virtualenv & PM2
echo "🛠️  Running remote installation and startup..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no ${REMOTE_USER}@${EC2_IP} "
    cd ${REMOTE_PATH}
    
    # Install OS dependencies (Python, Node.js, PM2)
    echo 'Checking and installing OS dependencies...'
    if command -v apt-get >/dev/null; then
        sudo apt-get update
        sudo apt-get install -y python3 python3-pip python3-venv nodejs npm
        sudo npm install -g pm2 || true
    elif command -v yum >/dev/null; then
        sudo yum update -y
        sudo yum install -y python3 python3-pip nodejs npm
        sudo npm install -g pm2 || true
    fi

    # Setup virtual environment
    if [ ! -d venv ]; then
        echo 'Recreating virtual env on EC2...'
        python3 -m venv venv
    fi
    
    # Activate and install dependencies
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r requirements.txt
    
    # Stop existing PM2 process if any
    pm2 stop vetro-ai-service 2>/dev/null || true
    pm2 delete vetro-ai-service 2>/dev/null || true
    
    # Start AI service with PM2 using local virtualenv uvicorn
    echo 'Starting AI Service under PM2 daemon...'
    pm2 start \"./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000\" --name \"vetro-ai-service\"
    
    # Save PM2 state
    pm2 save
"

echo "=========================================================="
echo "✅ Vetro AI Flow successfully deployed and running on EC2!"
echo "📡 Health Endpoint: http://${EC2_IP}:8000/health"
echo "=========================================================="
