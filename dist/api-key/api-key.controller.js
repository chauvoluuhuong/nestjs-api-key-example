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
exports.ApiKeyController = void 0;
const common_1 = require("@nestjs/common");
const api_key_service_1 = require("./api-key.service");
const create_api_key_dto_1 = require("./dto/create-api-key.dto");
const update_api_key_dto_1 = require("./dto/update-api-key.dto");
let ApiKeyController = class ApiKeyController {
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
    }
    async create(createApiKeyDto) {
        const result = await this.apiKeyService.create(createApiKeyDto);
        return {
            message: 'API key created successfully',
            apiKey: result.apiKey,
            key: result.rawKey,
            warning: 'Store this key securely. It will not be shown again.',
        };
    }
    async findAll() {
        const apiKeys = await this.apiKeyService.findAll();
        return {
            message: 'API keys retrieved successfully',
            data: apiKeys,
            count: apiKeys.length,
        };
    }
    async findOne(id) {
        const apiKey = await this.apiKeyService.findOne(id);
        return {
            message: 'API key retrieved successfully',
            data: apiKey,
        };
    }
    async update(id, updateApiKeyDto) {
        const apiKey = await this.apiKeyService.update(id, updateApiKeyDto);
        return {
            message: 'API key updated successfully',
            data: apiKey,
        };
    }
    async remove(id) {
        await this.apiKeyService.remove(id);
        return {
            message: 'API key deleted successfully',
        };
    }
    async updateScopes(id, body) {
        const apiKey = await this.apiKeyService.updateScopes(id, body.scopes);
        return {
            message: 'API key scopes updated successfully',
            data: apiKey,
        };
    }
    async deactivate(id) {
        const apiKey = await this.apiKeyService.deactivate(id);
        return {
            message: 'API key deactivated successfully',
            data: apiKey,
        };
    }
    async activate(id) {
        const apiKey = await this.apiKeyService.activate(id);
        return {
            message: 'API key activated successfully',
            data: apiKey,
        };
    }
    async regenerate(id) {
        const result = await this.apiKeyService.regenerate(id);
        return {
            message: 'API key regenerated successfully',
            apiKey: result.apiKey,
            key: result.rawKey,
            warning: 'Store this key securely. It will not be shown again.',
        };
    }
    async getUsageStats(id) {
        const stats = await this.apiKeyService.getUsageStats(id);
        return {
            message: 'Usage statistics retrieved successfully',
            data: stats,
        };
    }
};
exports.ApiKeyController = ApiKeyController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_api_key_dto_1.CreateApiKeyDto]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_api_key_dto_1.UpdateApiKeyDto]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/scopes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "updateScopes", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/regenerate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "regenerate", null);
__decorate([
    (0, common_1.Get)(':id/usage'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "getUsageStats", null);
exports.ApiKeyController = ApiKeyController = __decorate([
    (0, common_1.Controller)('api-keys'),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], ApiKeyController);
//# sourceMappingURL=api-key.controller.js.map