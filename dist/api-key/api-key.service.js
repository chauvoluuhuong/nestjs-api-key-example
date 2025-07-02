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
exports.ApiKeyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const bcrypt = require("bcrypt");
const api_key_schema_1 = require("./schemas/api-key.schema");
let ApiKeyService = class ApiKeyService {
    constructor(apiKeyModel) {
        this.apiKeyModel = apiKeyModel;
    }
    async create(createApiKeyDto) {
        const rawKey = this.generateApiKey();
        const hashedKey = await bcrypt.hash(rawKey, 10);
        const existingApiKey = await this.apiKeyModel
            .findOne({
            name: createApiKeyDto.name,
        })
            .exec();
        if (existingApiKey) {
            throw new common_1.ConflictException("API key with this name already exists");
        }
        const apiKey = new this.apiKeyModel({
            ...createApiKeyDto,
            key: hashedKey,
            scopes: createApiKeyDto.scopes || ["read"],
        });
        const savedApiKey = await apiKey.save();
        const result = savedApiKey.toObject();
        delete result.key;
        return {
            apiKey: result,
            rawKey: rawKey,
        };
    }
    async findAll() {
        const apiKeys = await this.apiKeyModel
            .find()
            .select("-key")
            .exec();
        return apiKeys;
    }
    async findOne(id) {
        const apiKey = await this.apiKeyModel.findById(id).select("-key").exec();
        if (!apiKey) {
            throw new common_1.NotFoundException("API key not found");
        }
        return apiKey;
    }
    async findByKey(key) {
        const apiKeys = await this.apiKeyModel.find({ isActive: true }).exec();
        for (const apiKey of apiKeys) {
            const isValid = await bcrypt.compare(key, apiKey.key);
            if (isValid) {
                await this.apiKeyModel
                    .findByIdAndUpdate(apiKey._id, {
                    lastUsedAt: new Date(),
                    $inc: { usageCount: 1 },
                })
                    .exec();
                return apiKey;
            }
        }
        return null;
    }
    async update(id, updateApiKeyDto) {
        const apiKey = await this.apiKeyModel
            .findByIdAndUpdate(id, updateApiKeyDto, { new: true })
            .select("-key")
            .exec();
        if (!apiKey) {
            throw new common_1.NotFoundException("API key not found");
        }
        return apiKey;
    }
    async remove(id) {
        const result = await this.apiKeyModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException("API key not found");
        }
    }
    async updateScopes(id, scopes) {
        const apiKey = await this.apiKeyModel
            .findByIdAndUpdate(id, { scopes }, { new: true })
            .select("-key")
            .exec();
        if (!apiKey) {
            throw new common_1.NotFoundException("API key not found");
        }
        return apiKey;
    }
    async deactivate(id) {
        return this.update(id, { isActive: false });
    }
    async activate(id) {
        return this.update(id, { isActive: true });
    }
    async regenerate(id) {
        const existingApiKey = await this.apiKeyModel.findById(id).exec();
        if (!existingApiKey) {
            throw new common_1.NotFoundException("API key not found");
        }
        const rawKey = this.generateApiKey();
        const hashedKey = await bcrypt.hash(rawKey, 10);
        const updatedApiKey = await this.apiKeyModel
            .findByIdAndUpdate(id, {
            key: hashedKey,
            usageCount: 0,
            lastUsedAt: null,
        }, { new: true })
            .select("-key")
            .exec();
        return {
            apiKey: updatedApiKey,
            rawKey: rawKey,
        };
    }
    generateApiKey() {
        const prefix = process.env.API_KEY_PREFIX || "ak_";
        const randomString = (0, uuid_1.v4)().replace(/-/g, "");
        return `${prefix}${randomString}`;
    }
    async validateApiKeyScopes(apiKey, requiredScopes) {
        if (!requiredScopes || requiredScopes.length === 0) {
            return true;
        }
        return requiredScopes.every((scope) => apiKey.scopes.includes(scope));
    }
    async getUsageStats(id) {
        const apiKey = await this.apiKeyModel.findById(id).select("-key").exec();
        if (!apiKey) {
            throw new common_1.NotFoundException("API key not found");
        }
        return {
            name: apiKey.name,
            usageCount: apiKey.usageCount,
            lastUsedAt: apiKey.lastUsedAt,
            createdAt: apiKey.createdAt,
            isActive: apiKey.isActive,
            scopes: apiKey.scopes,
        };
    }
};
exports.ApiKeyService = ApiKeyService;
exports.ApiKeyService = ApiKeyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(api_key_schema_1.ApiKey.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ApiKeyService);
//# sourceMappingURL=api-key.service.js.map