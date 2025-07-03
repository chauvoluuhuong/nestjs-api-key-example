# Structured Scope System

The API Key Management System now uses a sophisticated scope system that combines **resources** and **permissions** for fine-grained access control.

## Permission Enum

The system uses a standardized set of permissions:

```typescript
enum Permission {
  READ = "READ", // View/read access
  WRITE = "WRITE", // Create new resources
  UPDATE = "UPDATE", // Modify existing resources
  DELETE = "DELETE", // Remove resources
}
```

## Scope Structure

Each scope consists of:

- **Resource**: The entity or domain (e.g., 'users', 'posts', 'analytics', '\*')
- **Permissions**: Array of operations allowed on that resource

```typescript
interface ApiKeyScope {
  resource: string;
  permissions: Permission[];
}
```

## Creating API Keys with Structured Scopes

### Basic User Management

```bash
curl -X POST http://localhost:3000/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User Management Key",
    "description": "API key for user operations",
    "scopes": [
      {
        "resource": "users",
        "permissions": ["READ", "WRITE", "UPDATE"]
      },
      {
        "resource": "profiles",
        "permissions": ["READ", "UPDATE"]
      }
    ]
  }'
```

### Admin Access (All Permissions)

```bash
curl -X POST http://localhost:3000/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Key",
    "description": "Full admin access",
    "scopes": [
      {
        "resource": "*",
        "permissions": ["READ", "WRITE", "UPDATE", "DELETE"]
      }
    ]
  }'
```

### Read-Only Analytics

```bash
curl -X POST http://localhost:3000/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics Dashboard",
    "description": "Read-only analytics access",
    "scopes": [
      {
        "resource": "analytics",
        "permissions": ["READ"]
      },
      {
        "resource": "reports",
        "permissions": ["READ"]
      }
    ]
  }'
```

## Using Scope Decorators

### New Structured Decorators

```typescript
import { RequireRead, RequireResource, RequireScopes } from './auth/decorators/require-scopes.decorator';
import { Permission } from './auth/enums/permission.enum';

// Require READ permission on 'users' resource
@RequireRead('users')

// Require multiple permissions on a resource
@RequireResource('posts', Permission.READ, Permission.WRITE, Permission.UPDATE)

// Require complex multi-resource access
@RequireScopes([
  { resource: 'users', permissions: [Permission.READ] },
  { resource: 'analytics', permissions: [Permission.READ] }
])
```

### Convenience Decorators

```typescript
// Single permission decorators
@RequireRead('resource')     // READ permission
@RequireWrite('resource')    // WRITE permission
@RequireUpdate('resource')   // UPDATE permission
@RequireDelete('resource')   // DELETE permission

// Multiple permissions on one resource
@RequireResource('resource', Permission.READ, Permission.WRITE)
```

## Resource Wildcards

Use `*` as a resource to grant permissions on all resources:

```json
{
  "resource": "*",
  "permissions": ["READ", "WRITE"]
}
```

This grants READ and WRITE permissions on any resource.

## Example Use Cases

### 1. Content Management System

```json
{
  "name": "CMS API Key",
  "scopes": [
    {
      "resource": "posts",
      "permissions": ["READ", "WRITE", "UPDATE", "DELETE"]
    },
    {
      "resource": "comments",
      "permissions": ["READ", "UPDATE", "DELETE"]
    },
    {
      "resource": "media",
      "permissions": ["READ", "WRITE"]
    }
  ]
}
```

### 2. Third-Party Integration

```json
{
  "name": "Integration Key",
  "scopes": [
    {
      "resource": "webhooks",
      "permissions": ["READ", "WRITE"]
    },
    {
      "resource": "public-data",
      "permissions": ["READ"]
    }
  ]
}
```

### 3. Mobile App Backend

```json
{
  "name": "Mobile App Key",
  "scopes": [
    {
      "resource": "users",
      "permissions": ["READ", "UPDATE"]
    },
    {
      "resource": "profiles",
      "permissions": ["READ", "WRITE", "UPDATE"]
    },
    {
      "resource": "notifications",
      "permissions": ["READ", "WRITE"]
    }
  ]
}
```

## Legacy Scope Support

The system maintains backward compatibility with string-based scopes:

```typescript
// Legacy format (still supported)
@RequireLegacyScopes('read', 'write')

// Maps to new format:
// [{ resource: '*', permissions: ['READ', 'WRITE'] }]
```

### Legacy Mapping

| Legacy Scope  | New Format                                                              |
| ------------- | ----------------------------------------------------------------------- |
| `'read'`      | `{ resource: '*', permissions: ['READ'] }`                              |
| `'write'`     | `{ resource: '*', permissions: ['WRITE'] }`                             |
| `'update'`    | `{ resource: '*', permissions: ['UPDATE'] }`                            |
| `'delete'`    | `{ resource: '*', permissions: ['DELETE'] }`                            |
| `'admin'`     | `{ resource: '*', permissions: ['READ', 'WRITE', 'UPDATE', 'DELETE'] }` |
| `'analytics'` | `{ resource: 'analytics', permissions: ['READ'] }`                      |

## Updating Scopes

Update an existing API key's scopes:

```bash
curl -X PATCH http://localhost:3000/api-keys/{id}/scopes \
  -H "Content-Type: application/json" \
  -d '{
    "scopes": [
      {
        "resource": "users",
        "permissions": ["READ", "WRITE", "UPDATE", "DELETE"]
      }
    ]
  }'
```

## Validation Logic

The system validates scopes by:

1. **Resource Matching**: Exact match or wildcard (`*`)
2. **Permission Checking**: All required permissions must be present
3. **Multiple Resources**: All required resource/permission combinations must be satisfied

### Example Validation

Required: `users:READ,WRITE` and `analytics:READ`

✅ **Valid API Key Scopes:**

```json
[
  { "resource": "users", "permissions": ["READ", "WRITE", "UPDATE"] },
  { "resource": "analytics", "permissions": ["READ"] }
]
```

✅ **Valid with Wildcard:**

```json
[{ "resource": "*", "permissions": ["READ", "WRITE"] }]
```

❌ **Invalid (missing analytics):**

```json
[{ "resource": "users", "permissions": ["READ", "WRITE"] }]
```

❌ **Invalid (insufficient permissions):**

```json
[
  { "resource": "users", "permissions": ["READ"] },
  { "resource": "analytics", "permissions": ["READ"] }
]
```

## Error Messages

Clear error messages help debug scope issues:

```json
{
  "statusCode": 403,
  "message": "Insufficient scopes. Missing: users:WRITE, analytics:READ. Available: users:READ, posts:READ,WRITE",
  "error": "Forbidden"
}
```

## Best Practices

1. **Principle of Least Privilege**: Grant only necessary permissions
2. **Resource Specificity**: Use specific resources instead of wildcards when possible
3. **Regular Audits**: Review and update API key scopes periodically
4. **Expiration Dates**: Set expiration dates for temporary access
5. **Monitoring**: Track API key usage and scope utilization

## Migration from Legacy Scopes

To migrate from string-based to structured scopes:

1. **Audit Existing Keys**: Review current scope usage
2. **Map to New Format**: Convert string scopes to resource/permission pairs
3. **Update Applications**: Modify code to use new decorators
4. **Test Thoroughly**: Verify access control works as expected
5. **Gradual Rollout**: Migrate incrementally to minimize disruption
