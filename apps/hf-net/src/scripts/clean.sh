#!/bin/bash

# bring the network down
pnpm netdn

# Stop all running containers
docker stop $(docker ps -aq)

# remove your images and start from scratch
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -q)
docker volume rm -f $(docker volume ls -q)

# Removes dangling volumes
docker volume prune -f

# wipe previous networks and start with a fresh environment
docker network prune -f

# System prune to remove unused build cache, dangling images, and stopped containers
docker system prune -a -f

echo "docker clean!"