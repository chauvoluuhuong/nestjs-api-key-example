import { Injectable } from "@nestjs/common";
import { Permission } from "../enums/permission.enum";
import {
  ApiKeyScope,
  ScopeValidationResult,
} from "../interfaces/scope.interface";

@Injectable()
export class ScopeValidationService {
  /**
   * Validates if the provided scopes have the required permissions for a resource
   */
  validateScopes(
    apiKeyScopes: ApiKeyScope[],
    requiredResource: string,
    requiredPermissions: Permission[]
  ): ScopeValidationResult {
    // Find the scope for the required resource
    const resourceScope = apiKeyScopes.find(
      (scope) => scope.resource === requiredResource
    );

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

    // Check if all required permissions are present
    const missingPermissions = requiredPermissions.filter(
      (permission) => !resourceScope.permissions.includes(permission)
    );

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

  /**
   * Validates multiple resource requirements
   */
  validateMultipleScopes(
    apiKeyScopes: ApiKeyScope[],
    requirements: { resource: string; permissions: Permission[] }[]
  ): ScopeValidationResult {
    const missingScopes: {
      resource: string;
      missingPermissions: Permission[];
    }[] = [];

    for (const requirement of requirements) {
      const result = this.validateScopes(
        apiKeyScopes,
        requirement.resource,
        requirement.permissions
      );

      if (!result.hasAccess && result.missingScopes) {
        missingScopes.push(...result.missingScopes);
      }
    }

    return {
      hasAccess: missingScopes.length === 0,
      missingScopes: missingScopes.length > 0 ? missingScopes : undefined,
    };
  }

  /**
   * Convert legacy string scopes to new structured format
   */
  convertLegacyScopes(legacyScopes: string[]): ApiKeyScope[] {
    const scopeMap = new Map<string, Set<Permission>>();

    // Map legacy scopes to resources and permissions
    legacyScopes.forEach((scope) => {
      switch (scope) {
        case "read":
          this.addPermissionToResource(scopeMap, "*", Permission.READ);
          break;
        case "write":
          this.addPermissionToResource(scopeMap, "*", Permission.WRITE);
          break;
        case "update":
          this.addPermissionToResource(scopeMap, "*", Permission.UPDATE);
          break;
        case "delete":
          this.addPermissionToResource(scopeMap, "*", Permission.DELETE);
          break;
        case "admin":
          // Admin gets all permissions on all resources
          this.addPermissionToResource(scopeMap, "*", Permission.READ);
          this.addPermissionToResource(scopeMap, "*", Permission.WRITE);
          this.addPermissionToResource(scopeMap, "*", Permission.UPDATE);
          this.addPermissionToResource(scopeMap, "*", Permission.DELETE);
          break;
        case "analytics":
          this.addPermissionToResource(scopeMap, "analytics", Permission.READ);
          break;
        default:
          // Handle custom resource scopes (e.g., "users:READ,WRITE")
          if (scope.includes(":")) {
            const [resource, permissionString] = scope.split(":");
            const permissions = permissionString.split(",") as Permission[];
            permissions.forEach((permission) => {
              if (Object.values(Permission).includes(permission)) {
                this.addPermissionToResource(scopeMap, resource, permission);
              }
            });
          }
      }
    });

    // Convert map to array
    return Array.from(scopeMap.entries()).map(([resource, permissions]) => ({
      resource,
      permissions: Array.from(permissions),
    }));
  }

  private addPermissionToResource(
    scopeMap: Map<string, Set<Permission>>,
    resource: string,
    permission: Permission
  ): void {
    if (!scopeMap.has(resource)) {
      scopeMap.set(resource, new Set());
    }
    scopeMap.get(resource)!.add(permission);
  }

  /**
   * Format scopes for display
   */
  formatScopesForDisplay(scopes: ApiKeyScope[]): string[] {
    return scopes.map(
      (scope) => `${scope.resource}:${scope.permissions.join(",")}`
    );
  }
}
