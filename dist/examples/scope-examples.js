"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleApiKeyRequests = exports.thirdPartyIntegrationScopes = exports.contentManagementScopes = exports.analyticsReadOnlyScopes = exports.adminScopes = exports.userManagementScopes = void 0;
const permission_enum_1 = require("../auth/enums/permission.enum");
exports.userManagementScopes = [
    {
        resource: "users",
        permissions: [permission_enum_1.Permission.READ, permission_enum_1.Permission.WRITE, permission_enum_1.Permission.UPDATE],
    },
    {
        resource: "profiles",
        permissions: [permission_enum_1.Permission.READ, permission_enum_1.Permission.UPDATE],
    },
];
exports.adminScopes = [
    {
        resource: "*",
        permissions: [
            permission_enum_1.Permission.READ,
            permission_enum_1.Permission.WRITE,
            permission_enum_1.Permission.UPDATE,
            permission_enum_1.Permission.DELETE,
        ],
    },
];
exports.analyticsReadOnlyScopes = [
    {
        resource: "analytics",
        permissions: [permission_enum_1.Permission.READ],
    },
    {
        resource: "reports",
        permissions: [permission_enum_1.Permission.READ],
    },
];
exports.contentManagementScopes = [
    {
        resource: "posts",
        permissions: [
            permission_enum_1.Permission.READ,
            permission_enum_1.Permission.WRITE,
            permission_enum_1.Permission.UPDATE,
            permission_enum_1.Permission.DELETE,
        ],
    },
    {
        resource: "comments",
        permissions: [permission_enum_1.Permission.READ, permission_enum_1.Permission.UPDATE, permission_enum_1.Permission.DELETE],
    },
    {
        resource: "media",
        permissions: [permission_enum_1.Permission.READ, permission_enum_1.Permission.WRITE],
    },
];
exports.thirdPartyIntegrationScopes = [
    {
        resource: "webhooks",
        permissions: [permission_enum_1.Permission.READ, permission_enum_1.Permission.WRITE],
    },
    {
        resource: "public-data",
        permissions: [permission_enum_1.Permission.READ],
    },
];
exports.exampleApiKeyRequests = {
    userApiKey: {
        name: "User Management Key",
        description: "API key for user management operations",
        scopes: exports.userManagementScopes,
        expiresAt: new Date("2025-12-31"),
    },
    adminApiKey: {
        name: "Admin Key",
        description: "Full access admin API key",
        scopes: exports.adminScopes,
    },
    analyticsKey: {
        name: "Analytics Dashboard",
        description: "Read-only access for analytics dashboard",
        scopes: exports.analyticsReadOnlyScopes,
        expiresAt: new Date("2025-06-30"),
    },
    contentKey: {
        name: "Content Management",
        description: "API key for content management system",
        scopes: exports.contentManagementScopes,
    },
    integrationKey: {
        name: "Third-party Integration",
        description: "Limited access for external integrations",
        scopes: exports.thirdPartyIntegrationScopes,
        expiresAt: new Date("2025-03-31"),
    },
};
//# sourceMappingURL=scope-examples.js.map