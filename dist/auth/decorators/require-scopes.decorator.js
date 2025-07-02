"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireScopes = exports.REQUIRE_SCOPES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_SCOPES_KEY = 'requireScopes';
const RequireScopes = (...scopes) => (0, common_1.SetMetadata)(exports.REQUIRE_SCOPES_KEY, scopes);
exports.RequireScopes = RequireScopes;
//# sourceMappingURL=require-scopes.decorator.js.map