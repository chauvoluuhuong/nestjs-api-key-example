"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireLegacyScopes = exports.RequireDelete = exports.RequireUpdate = exports.RequireWrite = exports.RequireRead = exports.RequireResource = exports.RequireScopes = exports.REQUIRE_SCOPES_KEY = void 0;
const common_1 = require("@nestjs/common");
const permission_enum_1 = require("../enums/permission.enum");
exports.REQUIRE_SCOPES_KEY = "requireScopes";
const RequireScopes = (requirements) => (0, common_1.SetMetadata)(exports.REQUIRE_SCOPES_KEY, requirements);
exports.RequireScopes = RequireScopes;
const RequireResource = (resource, ...permissions) => (0, exports.RequireScopes)([{ resource, permissions }]);
exports.RequireResource = RequireResource;
const RequireRead = (resource) => (0, exports.RequireResource)(resource, permission_enum_1.Permission.READ);
exports.RequireRead = RequireRead;
const RequireWrite = (resource) => (0, exports.RequireResource)(resource, permission_enum_1.Permission.WRITE);
exports.RequireWrite = RequireWrite;
const RequireUpdate = (resource) => (0, exports.RequireResource)(resource, permission_enum_1.Permission.UPDATE);
exports.RequireUpdate = RequireUpdate;
const RequireDelete = (resource) => (0, exports.RequireResource)(resource, permission_enum_1.Permission.DELETE);
exports.RequireDelete = RequireDelete;
const RequireLegacyScopes = (...scopes) => {
    const requirements = [];
    scopes.forEach((scope) => {
        switch (scope) {
            case "read":
                requirements.push({ resource: "*", permissions: [permission_enum_1.Permission.READ] });
                break;
            case "write":
                requirements.push({ resource: "*", permissions: [permission_enum_1.Permission.WRITE] });
                break;
            case "update":
                requirements.push({ resource: "*", permissions: [permission_enum_1.Permission.UPDATE] });
                break;
            case "delete":
                requirements.push({ resource: "*", permissions: [permission_enum_1.Permission.DELETE] });
                break;
            case "admin":
                requirements.push({
                    resource: "*",
                    permissions: [
                        permission_enum_1.Permission.READ,
                        permission_enum_1.Permission.WRITE,
                        permission_enum_1.Permission.UPDATE,
                        permission_enum_1.Permission.DELETE,
                    ],
                });
                break;
            case "analytics":
                requirements.push({
                    resource: "analytics",
                    permissions: [permission_enum_1.Permission.READ],
                });
                break;
            default:
                if (scope.includes(":")) {
                    const [resource, permissionString] = scope.split(":");
                    const permissions = permissionString.split(",");
                    const validPermissions = permissions.filter((p) => Object.values(permission_enum_1.Permission).includes(p));
                    if (validPermissions.length > 0) {
                        requirements.push({ resource, permissions: validPermissions });
                    }
                }
        }
    });
    return (0, exports.RequireScopes)(requirements);
};
exports.RequireLegacyScopes = RequireLegacyScopes;
//# sourceMappingURL=require-scopes.decorator.js.map