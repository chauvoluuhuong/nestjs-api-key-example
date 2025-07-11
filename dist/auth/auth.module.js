"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const api_key_module_1 = require("../api-key/api-key.module");
const api_key_guard_1 = require("./guards/api-key.guard");
const scope_validation_service_1 = require("./services/scope-validation.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [api_key_module_1.ApiKeyModule],
        providers: [api_key_guard_1.ApiKeyGuard, scope_validation_service_1.ScopeValidationService],
        exports: [api_key_guard_1.ApiKeyGuard, scope_validation_service_1.ScopeValidationService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map