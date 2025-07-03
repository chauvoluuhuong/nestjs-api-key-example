"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const api_key_guard_1 = require("./auth/guards/api-key.guard");
const require_scopes_decorator_1 = require("./auth/decorators/require-scopes.decorator");
const permission_enum_1 = require("./auth/enums/permission.enum");
const current_api_key_decorator_1 = require("./auth/decorators/current-api-key.decorator");
const api_key_schema_1 = require("./api-key/schemas/api-key.schema");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getProtectedData(apiKey) {
        return {
            message: "This is protected data",
            accessedBy: apiKey.name,
            scopes: apiKey.scopes,
            timestamp: new Date().toISOString(),
        };
    }
    getAdminData(apiKey) {
        return {
            message: "This is admin data",
            accessedBy: apiKey.name,
            scopes: apiKey.scopes,
            timestamp: new Date().toISOString(),
        };
    }
    getAnalytics(apiKey) {
        return {
            message: "Analytics data",
            data: {
                users: 1500,
                revenue: 50000,
                growth: 12.5,
            },
            accessedBy: apiKey.name,
            scopes: apiKey.scopes,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)("protected"),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, require_scopes_decorator_1.RequireRead)("*"),
    __param(0, (0, current_api_key_decorator_1.CurrentApiKey)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [api_key_schema_1.ApiKey]),
    __metadata("design:returntype", Object)
], AppController.prototype, "getProtectedData", null);
__decorate([
    (0, common_1.Get)("admin"),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, require_scopes_decorator_1.RequireResource)("admin", permission_enum_1.Permission.WRITE, permission_enum_1.Permission.DELETE),
    (0, require_scopes_decorator_1.RequireResource)("analytics", permission_enum_1.Permission.READ),
    __param(0, (0, current_api_key_decorator_1.CurrentApiKey)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [api_key_schema_1.ApiKey]),
    __metadata("design:returntype", Object)
], AppController.prototype, "getAdminData", null);
__decorate([
    (0, common_1.Get)("analytics"),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, require_scopes_decorator_1.RequireRead)("analytics"),
    __param(0, (0, current_api_key_decorator_1.CurrentApiKey)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [api_key_schema_1.ApiKey]),
    __metadata("design:returntype", Object)
], AppController.prototype, "getAnalytics", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map