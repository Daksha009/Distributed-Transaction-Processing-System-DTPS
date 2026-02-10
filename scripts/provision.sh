#!/bin/bash
# provision.sh
# Automates the setup of an Ubuntu 22.04 LTS instance for the DTPS application.
# Installs OpenJDK 24 (via EA build or latest available), Docker, Maven.
# Creates a non-privileged user and configures security basics.

set -e

echo "Starting DTPS Provisioning on Ubuntu 22.04..."

# 1. Update & Upgrade System
echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Common Dependencies
echo "Installing dependencies..."
sudo apt-get install -y curl wget unzip gnupg lsb-release ca-certificates

# 3. Install OpenJDK 24 (Early Access) or 21 (LTS) if 24 is unstable
# Using JDK 21 LTS as the stable base for Virtual Threads, but allowing upgrade.
# For this script, we'll install OpenJDK 21 which is standard and supports Virtual Threads.
# If strictly JDK 24 is needed, replace with EA download link.
echo "Installing OpenJDK 21 (LTS)..."
sudo apt-get install -y openjdk-21-jdk

# Verify Java version
java -version

# 4. Install Docker Engine
echo "Installing Docker..."
# Add Docker's official GPG key:
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 5. Install Maven
echo "Installing Maven..."
sudo apt-get install -y maven
mvn -version

# 6. Security Hardening: Create Non-privileged Service User
echo "Creating service user 'dtps-user'..."
if id "dtps-user" &>/dev/null; then
    echo "User 'dtps-user' already exists."
else
    # Create system user with no login shell
    sudo useradd -r -s /bin/false dtps-user
    echo "User 'dtps-user' created."
fi

# 7. Setup Application Directory
echo "Setting up application directory /opt/dtps..."
sudo mkdir -p /opt/dtps
sudo chown dtps-user:dtps-user /opt/dtps
sudo chmod 750 /opt/dtps

echo "Provisioning complete!"
