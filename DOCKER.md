# Docker Setup Guide

## Overview

This project includes Docker Compose files to easily run MongoDB locally without any authentication or authorization setup.

## Files

- `docker-compose.yml` - Full setup with MongoDB + Mongo Express web UI
- `docker-compose.simple.yml` - MongoDB only (minimal setup)

## Quick Start

### 1. Start MongoDB with Web UI

```bash
docker-compose up -d
```

This starts:

- **MongoDB** on port `27017`
- **Mongo Express** (web UI) on port `8081`

Access the web UI at: http://localhost:8081

- Username: `admin`
- Password: `admin123`

### 2. Start MongoDB Only (Simple)

```bash
docker-compose -f docker-compose.simple.yml up -d
```

This starts only MongoDB on port `27017`.

## Container Details

### MongoDB Container

- **Image**: `mongo:7.0`
- **Container Name**: `nestjs-api-key-mongodb`
- **Port**: `27017:27017`
- **Database**: `nestjs-api-key-db`
- **Authentication**: Disabled (development mode)
- **Data Persistence**: Yes (via Docker volumes)

### Mongo Express Container (Web UI)

- **Image**: `mongo-express:1.0.0`
- **Container Name**: `nestjs-api-key-mongo-express`
- **Port**: `8081:8081`
- **Access**: http://localhost:8081

## Common Commands

```bash
# Start containers
docker-compose up -d

# View running containers
docker ps

# View logs
docker-compose logs mongodb
docker-compose logs mongo-express

# Stop containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (WARNING: Deletes all data)
docker-compose down -v

# Restart containers
docker-compose restart

# View container resource usage
docker stats
```

## Volumes

Data is persisted in Docker volumes:

- `mongodb_data` - Database files
- `mongodb_config` - MongoDB configuration

## Network

Containers communicate via the `api-key-network` bridge network.

## Environment Variables

The MongoDB container uses these environment variables:

- `MONGO_INITDB_DATABASE=nestjs-api-key-db` - Creates the initial database

## Security Notes

⚠️ **This setup is for development only**

- No authentication/authorization
- Default credentials for Mongo Express
- Not suitable for production use

For production:

1. Enable MongoDB authentication
2. Use strong passwords
3. Configure SSL/TLS
4. Restrict network access
5. Regular security updates

## Troubleshooting

### Port Conflicts

If ports 27017 or 8081 are in use:

```yaml
# Edit docker-compose.yml
ports:
  - "27018:27017" # Change host port
```

### Permission Issues

```bash
# Fix Docker permissions (Linux/macOS)
sudo chown -R $USER:$USER ./
```

### View Container Logs

```bash
# MongoDB logs
docker logs nestjs-api-key-mongodb

# Mongo Express logs
docker logs nestjs-api-key-mongo-express
```

### Reset Database

```bash
# Stop containers and remove all data
docker-compose down -v

# Start fresh
docker-compose up -d
```
