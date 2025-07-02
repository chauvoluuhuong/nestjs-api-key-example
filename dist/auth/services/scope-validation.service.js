"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeValidationService = void 0;
const common_1 = require("@nestjs/common");
const permission_enum_1 = require("../enums/permission.enum");
let ScopeValidationService = class ScopeValidationService {
    validateScopes(apiKeyScopes, requiredResource, requiredPermissions) {
        const resourceScope = apiKeyScopes.find((scope) => scope.resource === requiredResource);
        if (!resourceScope) {
            return {
                hasAccess: false,
                missingScopes: [
                    {
                        resource: requiredResource,
                        missingPermissions: requiredPermissions,
                    },
                ],
            };
        }
        const missingPermissions = requiredPermissions.filter((permission) => !resourceScope.permissions.includes(permission));
        if (missingPermissions.length > 0) {
            return {
                hasAccess: false,
                missingScopes: [
                    {
                        resource: requiredResource,
                        missingPermissions,
                    },
                ],
            };
        }
        return { hasAccess: true };
    }
    validateMultipleScopes(apiKeyScopes, requirements) {
        const missingScopes = [];
        for (const requirement of requirements) {
            const result = this.validateScopes(apiKeyScopes, requirement.resource, requirement.permissions);
            if (!result.hasAccess && result.missingScopes) {
                missingScopes.push(...result.missingScopes);
            }
        }
        return {
            hasAccess: missingScopes.length === 0,
            missingScopes: missingScopes.length > 0 ? missingScopes : undefined,
        };
    }
    convertLegacyScopes(legacyScopes) {
        const scopeMap = new Map();
        legacyScopes.forEach((scope) => {
            switch (scope) {
                case "read":
                    this.addPermissionToResource(scopeMap, "*", permission_enum_1.Permission.READ);
                    break;
                case "write":
                    this.addPermissionToResource(scopeMap, "*", permission_enum_1.Permission.WRITE);
                    break;
                case "update":
                    this.addPermissionToResource(scopeMap, "*", permission_enum_1.Permission.UPDATE);
                    break;
                case "delete":
                    this.addPermissionToResource(scopeMap, "*", permission_enum_1.Permission.DELETE);
                    break;
                case "admin":
                    this.addPermissionToResource(scopeMap, "*", permission_enum_1.Permission.READ);
                    this.addPermissionToResource(scopeMap, "*", permission_enum_1.Permission.WRITE);
                    this.addPermissionToResource(scopeMap, "*", permission_enum_1.Permission.UPDATE);
                    this.addPermissionToResource(scopeMap, "*", permission_enum_1.Permission.DELETE);
                    break;
                case "analytics":
                    this.addPermissionToResource(scopeMap, "analytics", permission_enum_1.Permission.READ);
                    break;
                default:
                    if (scope.includes(":")) {
                        const [resource, permissionString] = scope.split(":");
                        const permissions = permissionString.split(",");
                        permissions.forEach((permission) => {
                            if (Object.values(permission_enum_1.Permission).includes(permission)) {
                                this.addPermissionToResource(scopeMap, resource, permission);
                            }
                        });
                    }
            }
        });
        return Array.from(scopeMap.entries()).map(([resource, permissions]) => ({
            resource,
            permissions: Array.from(permissions),
        }));
    }
    addPermissionToResource(scopeMap, resource, permission) {
        if (!scopeMap.has(resource)) {
            scopeMap.set(resource, new Set());
        }
        scopeMap.get(resource).add(permission);
    }
    formatScopesForDisplay(scopes) {
        return scopes.map((scope) => `${scope.resource}:${scope.permissions.join(",")}`);
    }
};
exports.ScopeValidationService = ScopeValidationService;
exports.ScopeValidationService = ScopeValidationService = __decorate([
    (0, common_1.Injectable)()
], ScopeValidationService);
//# sourceMappingURL=scope-validation.service.js.map