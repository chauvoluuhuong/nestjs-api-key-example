"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_PERMISSIONS = exports.Permission = void 0;
var Permission;
(function (Permission) {
    Permission["READ"] = "READ";
    Permission["WRITE"] = "WRITE";
    Permission["UPDATE"] = "UPDATE";
    Permission["DELETE"] = "DELETE";
})(Permission || (exports.Permission = Permission = {}));
exports.ALL_PERMISSIONS = Object.values(Permission);
//# sourceMappingURL=permission.enum.js.map