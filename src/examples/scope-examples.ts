import { Permission } from "../auth/enums/permission.enum";
import { ApiKeyScopeDto } from "../auth/dto/scope.dto";

// Examples of structured scopes for different use cases

// Example 1: Basic user management scopes
export const userManagementScopes: ApiKeyScopeDto[] = [
  {
    resource: "users",
    permissions: [Permission.READ, Permission.WRITE, Permission.UPDATE],
  },
  {
    resource: "profiles",
    permissions: [Permission.READ, Permission.UPDATE],
  },
];

// Example 2: Admin scopes with full access
export const adminScopes: ApiKeyScopeDto[] = [
  {
    resource: "*", // Wildcard for all resources
    permissions: [
      Permission.READ,
      Permission.WRITE,
      Permission.UPDATE,
      Permission.DELETE,
    ],
  },
];

// Example 3: Read-only analytics access
export const analyticsReadOnlyScopes: ApiKeyScopeDto[] = [
  {
    resource: "analytics",
    permissions: [Permission.READ],
  },
  {
    resource: "reports",
    permissions: [Permission.READ],
  },
];

// Example 4: Content management scopes
export const contentManagementScopes: ApiKeyScopeDto[] = [
  {
    resource: "posts",
    permissions: [
      Permission.READ,
      Permission.WRITE,
      Permission.UPDATE,
      Permission.DELETE,
    ],
  },
  {
    resource: "comments",
    permissions: [Permission.READ, Permission.UPDATE, Permission.DELETE],
  },
  {
    resource: "media",
    permissions: [Permission.READ, Permission.WRITE],
  },
];

// Example 5: Limited API access for third-party integrations
export const thirdPartyIntegrationScopes: ApiKeyScopeDto[] = [
  {
    resource: "webhooks",
    permissions: [Permission.READ, Permission.WRITE],
  },
  {
    resource: "public-data",
    permissions: [Permission.READ],
  },
];

// Example API key creation requests
export const exampleApiKeyRequests = {
  // Basic user API key
  userApiKey: {
    name: "User Management Key",
    description: "API key for user management operations",
    scopes: userManagementScopes,
    expiresAt: new Date("2025-12-31"),
  },

  // Admin API key
  adminApiKey: {
    name: "Admin Key",
    description: "Full access admin API key",
    scopes: adminScopes,
  },

  // Analytics read-only key
  analyticsKey: {
    name: "Analytics Dashboard",
    description: "Read-only access for analytics dashboard",
    scopes: analyticsReadOnlyScopes,
    expiresAt: new Date("2025-06-30"),
  },

  // Content management key
  contentKey: {
    name: "Content Management",
    description: "API key for content management system",
    scopes: contentManagementScopes,
  },

  // Third-party integration key
  integrationKey: {
    name: "Third-party Integration",
    description: "Limited access for external integrations",
    scopes: thirdPartyIntegrationScopes,
    expiresAt: new Date("2025-03-31"),
  },
};
