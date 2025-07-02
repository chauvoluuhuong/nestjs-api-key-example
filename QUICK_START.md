# Quick Start Guide

## Prerequisites

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Docker & Docker Compose** (Recommended) - [Download here](https://www.docker.com/products/docker-desktop)
   - OR **MongoDB** locally - [Download here](https://www.mongodb.com/try/download/community)
   - OR **MongoDB Atlas** (Cloud)

## 1. Install Dependencies

```bash
npm install
```

## 2. Start MongoDB

### Option A: Docker (Recommended)

```bash
# Start MongoDB with Docker Compose (includes Mongo Express web UI)
docker-compose up -d

# Or use the simple version (MongoDB only)
docker-compose -f docker-compose.simple.yml up -d

# Check if MongoDB is running
docker ps
```

Access Mongo Express (web UI) at http://localhost:8081 (username: admin, password: admin123)

### Option B: Local MongoDB Installation

```bash
# macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Option C: MongoDB Atlas (Cloud)

Update the `MONGODB_URI` in `.env` file with your Atlas connection string.

## 3. Configure Environment

The `.env` file is already created with default values. Update if needed:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nestjs-api-key-db
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production
API_KEY_PREFIX=ak_
```

## 4. Start the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start at http://localhost:3000

## 5. Test the API

### Create your first API key:

```bash
curl -X POST http://localhost:3000/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First API Key",
    "description": "Test key",
    "scopes": ["read", "write"]
  }'
```

### Use the API key:

```bash
# Replace YOUR_API_KEY with the key from the previous response
curl -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 6. Run the Test Script

```bash
node test-api.js
```

## Available Endpoints

| Method | Endpoint               | Description         | Auth Required                |
| ------ | ---------------------- | ------------------- | ---------------------------- |
| GET    | `/`                    | Health check        | No                           |
| POST   | `/api-keys`            | Create API key      | No                           |
| GET    | `/api-keys`            | List all API keys   | No                           |
| GET    | `/api-keys/:id`        | Get API key details | No                           |
| PUT    | `/api-keys/:id`        | Update API key      | No                           |
| DELETE | `/api-keys/:id`        | Delete API key      | No                           |
| PATCH  | `/api-keys/:id/scopes` | Update scopes       | No                           |
| GET    | `/protected`           | Protected endpoint  | Yes (read scope)             |
| GET    | `/admin`               | Admin endpoint      | Yes (write + admin scope)    |
| GET    | `/analytics`           | Analytics endpoint  | Yes (read + analytics scope) |

## Common Scopes

- `read` - Read access to resources
- `write` - Write access to resources
- `admin` - Administrative access
- `analytics` - Access to analytics data
- `delete` - Permission to delete resources

## Troubleshooting

### MongoDB Connection Issues

1. **Using Docker**: Run `docker-compose up -d` and check `docker ps`
2. **Local installation**: Ensure MongoDB service is running
3. Check the `MONGODB_URI` in `.env` file
4. For Atlas, ensure IP whitelist includes your IP

### Docker Commands

```bash
# Start containers
docker-compose up -d

# Check container status
docker ps

# View MongoDB logs
docker-compose logs mongodb

# Restart containers
docker-compose restart

# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v
```

### Port Already in Use

Change the `PORT` in `.env` file to a different port (e.g., 3001)

### API Key Not Working

1. Ensure the API key is active
2. Check if it has the required scopes
3. Verify the key hasn't expired

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints using Postman or similar tools
- Customize scopes based on your application needs
- Add rate limiting and additional security measures for production
