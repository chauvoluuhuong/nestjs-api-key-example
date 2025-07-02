# NestJS API Key Management System

A comprehensive NestJS application with API key authentication, MongoDB integration, and scope-based access control.

## Features

- 🔐 **API Key Authentication**: Secure API key generation and validation
- 🎯 **Scope Management**: Fine-grained access control with customizable scopes
- 🗄️ **MongoDB Integration**: Persistent storage with Mongoose
- 📊 **Usage Tracking**: Monitor API key usage and statistics
- ⚡ **Rate Limiting Support**: Built-in rate limiting capabilities
- 🔄 **Key Management**: Full CRUD operations for API keys
- 📝 **Comprehensive Logging**: Track usage patterns and access attempts

## Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose (recommended) OR MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nestjs-api-key-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/nestjs-api-key-db
   JWT_SECRET=your-jwt-secret-key-here
   API_KEY_PREFIX=ak_
   ```

4. **Start MongoDB**

   ```bash
   # Using Docker (recommended)
   docker-compose up -d

   # OR start MongoDB locally if installed
   # macOS: brew services start mongodb/brew/mongodb-community
   # Linux: sudo systemctl start mongod
   # Windows: net start MongoDB
   ```

5. **Run the application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## API Documentation

### API Key Management Endpoints

#### Create API Key

```http
POST /api-keys
Content-Type: application/json

{
  "name": "My API Key",
  "description": "API key for mobile app",
  "scopes": ["read", "write"],
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "metadata": {
    "app": "mobile",
    "version": "1.0"
  }
}
```

**Response:**

```json
{
  "message": "API key created successfully",
  "apiKey": {
    "_id": "64f8b2c1d4e5f6789a0b1c2d",
    "name": "My API Key",
    "description": "API key for mobile app",
    "scopes": ["read", "write"],
    "isActive": true,
    "usageCount": 0,
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  },
  "key": "ak_1234567890abcdef1234567890abcdef",
  "warning": "Store this key securely. It will not be shown again."
}
```

#### Get All API Keys

```http
GET /api-keys
```

#### Get API Key by ID

```http
GET /api-keys/:id
```

#### Update API Key

```http
PUT /api-keys/:id
Content-Type: application/json

{
  "name": "Updated API Key Name",
  "description": "Updated description"
}
```

#### Update API Key Scopes

```http
PATCH /api-keys/:id/scopes
Content-Type: application/json

{
  "scopes": ["read", "write", "admin"]
}
```

#### Deactivate API Key

```http
PATCH /api-keys/:id/deactivate
```

#### Activate API Key

```http
PATCH /api-keys/:id/activate
```

#### Regenerate API Key

```http
POST /api-keys/:id/regenerate
```

#### Get Usage Statistics

```http
GET /api-keys/:id/usage
```

#### Delete API Key

```http
DELETE /api-keys/:id
```

### Protected Endpoints

#### Basic Protected Route

```http
GET /protected
Authorization: Bearer ak_your_api_key_here
# OR
X-API-Key: ak_your_api_key_here
```

Requires: `read` scope

#### Admin Route

```http
GET /admin
Authorization: Bearer ak_your_api_key_here
```

Requires: `write` AND `admin` scopes

#### Analytics Route

```http
GET /analytics
Authorization: Bearer ak_your_api_key_here
```

Requires: `read` AND `analytics` scopes

## Scope System

The system now uses a **structured scope system** that combines resources and permissions for fine-grained access control.

### Structure

Each scope consists of:

- **Resource**: The entity/domain (e.g., 'users', 'posts', 'analytics', '\*')
- **Permissions**: Array of operations (READ, WRITE, UPDATE, DELETE)

### Example Structured Scopes

```json
{
  "scopes": [
    {
      "resource": "users",
      "permissions": ["READ", "WRITE", "UPDATE"]
    },
    {
      "resource": "analytics",
      "permissions": ["READ"]
    }
  ]
}
```

### Permission Types

- `READ`: View/read access to resources
- `WRITE`: Create new resources
- `UPDATE`: Modify existing resources
- `DELETE`: Remove resources

### Legacy Support

Simple string scopes are still supported for backward compatibility:

- `read`, `write`, `update`, `delete`: Global permissions
- `admin`: All permissions on all resources
- `analytics`: Read access to analytics

See [SCOPE_SYSTEM.md](SCOPE_SYSTEM.md) for detailed documentation.

## Authentication Methods

The API supports two authentication methods:

1. **Authorization Header**

   ```http
   Authorization: Bearer ak_your_api_key_here
   ```

2. **Custom Header**
   ```http
   X-API-Key: ak_your_api_key_here
   ```

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "API key is required",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Insufficient scopes. Required: write, admin. Available: read",
  "error": "Forbidden"
}
```

## Usage Examples

### Creating an API Key with Scopes

```bash
curl -X POST http://localhost:3000/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile App Key",
    "description": "API key for the mobile application",
    "scopes": ["read", "write"],
    "expiresAt": "2024-12-31T23:59:59.000Z"
  }'
```

### Using the API Key

```bash
curl -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer ak_1234567890abcdef1234567890abcdef"
```

### Updating Scopes

```bash
curl -X PATCH http://localhost:3000/api-keys/64f8b2c1d4e5f6789a0b1c2d/scopes \
  -H "Content-Type: application/json" \
  -d '{
    "scopes": ["read", "write", "admin"]
  }'
```

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Security Best Practices

1. **Store API keys securely**: Never expose API keys in client-side code
2. **Use HTTPS**: Always use HTTPS in production
3. **Implement rate limiting**: Use the built-in rate limiting features
4. **Monitor usage**: Regularly check API key usage statistics
5. **Rotate keys**: Periodically regenerate API keys
6. **Scope limitation**: Grant minimum required scopes
7. **Set expiration**: Use expiration dates for temporary access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
