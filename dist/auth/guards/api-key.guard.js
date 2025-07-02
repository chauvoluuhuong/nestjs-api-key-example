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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const api_key_service_1 = require("../../api-key/api-key.service");
const require_scopes_decorator_1 = require("../decorators/require-scopes.decorator");
let ApiKeyGuard = class ApiKeyGuard {
    constructor(apiKeyService, reflector) {
        this.apiKeyService = apiKeyService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKey = this.extractApiKeyFromHeader(request);
        if (!apiKey) {
            throw new common_1.UnauthorizedException('API key is required');
        }
        const validApiKey = await this.apiKeyService.findByKey(apiKey);
        if (!validApiKey) {
            throw new common_1.UnauthorizedException('Invalid API key');
        }
        if (!validApiKey.isActive) {
            throw new common_1.UnauthorizedException('API key is inactive');
        }
        if (validApiKey.expiresAt && new Date() > validApiKey.expiresAt) {
            throw new common_1.UnauthorizedException('API key has expired');
        }
        const requiredScopes = this.reflector.getAllAndOverride(require_scopes_decorator_1.REQUIRE_SCOPES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (requiredScopes && requiredScopes.length > 0) {
            const hasValidScopes = await this.apiKeyService.validateApiKeyScopes(validApiKey, requiredScopes);
            if (!hasValidScopes) {
                throw new common_1.ForbiddenException(`Insufficient scopes. Required: ${requiredScopes.join(', ')}. Available: ${validApiKey.scopes.join(', ')}`);
            }
        }
        request.apiKey = validApiKey;
        return true;
    }
    extractApiKeyFromHeader(request) {
        const authHeader = request.headers.authorization;
        const apiKeyHeader = request.headers['x-api-key'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        if (apiKeyHeader) {
            return apiKeyHeader;
        }
        return null;
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService,
        core_1.Reflector])
], ApiKeyGuard);
//# sourceMappingURL=api-key.guard.js.map