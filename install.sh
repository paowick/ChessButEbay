#!/bin/bash

# Step 1: Navigate to the root of the "src" folder
cd src

# Step 2: Install dependencies in each subfolder
subfolders=("apiCRUD" "authen" "socket" "userImage" "web")

for subfolder in "${subfolders[@]}"; do
    echo "Installing dependencies in $subfolder..."
    cd "$subfolder"
    npm i -y
    cd ..
done

# Step 3: Start Docker containers and launch services
echo "Starting Docker containers and launching services..."
cd ..
docker compose -f "docker-compose.yml" up -d --build 

echo "Setup completed."
