import { SetMetadata } from "@nestjs/common";
import { Permission } from "../enums/permission.enum";

export const REQUIRE_SCOPES_KEY = "requireScopes";

export interface RequiredScope {
  resource: string;
  permissions: Permission[];
}

// New structured decorator
export const RequireScopes = (requirements: RequiredScope[]) =>
  SetMetadata(REQUIRE_SCOPES_KEY, requirements);

// Convenience decorators for common patterns
export const RequireResource = (
  resource: string,
  ...permissions: Permission[]
) => RequireScopes([{ resource, permissions }]);

export const RequireRead = (resource: string) =>
  RequireResource(resource, Permission.READ);

export const RequireWrite = (resource: string) =>
  RequireResource(resource, Permission.WRITE);

export const RequireUpdate = (resource: string) =>
  RequireResource(resource, Permission.UPDATE);

export const RequireDelete = (resource: string) =>
  RequireResource(resource, Permission.DELETE);

// Legacy support - convert string scopes to new format
export const RequireLegacyScopes = (...scopes: string[]) => {
  const requirements: RequiredScope[] = [];

  scopes.forEach((scope) => {
    switch (scope) {
      case "read":
        requirements.push({ resource: "*", permissions: [Permission.READ] });
        break;
      case "write":
        requirements.push({ resource: "*", permissions: [Permission.WRITE] });
        break;
      case "update":
        requirements.push({ resource: "*", permissions: [Permission.UPDATE] });
        break;
      case "delete":
        requirements.push({ resource: "*", permissions: [Permission.DELETE] });
        break;
      case "admin":
        requirements.push({
          resource: "*",
          permissions: [
            Permission.READ,
            Permission.WRITE,
            Permission.UPDATE,
            Permission.DELETE,
          ],
        });
        break;
      case "analytics":
        requirements.push({
          resource: "analytics",
          permissions: [Permission.READ],
        });
        break;
      default:
        // Handle custom resource scopes (e.g., "users:READ,WRITE")
        if (scope.includes(":")) {
          const [resource, permissionString] = scope.split(":");
          const permissions = permissionString.split(",") as Permission[];
          const validPermissions = permissions.filter((p) =>
            Object.values(Permission).includes(p)
          );
          if (validPermissions.length > 0) {
            requirements.push({ resource, permissions: validPermissions });
          }
        }
    }
  });

  return RequireScopes(requirements);
};
