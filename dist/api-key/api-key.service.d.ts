import { Model } from "mongoose";
import { ApiKey, ApiKeyDocument } from "./schemas/api-key.schema";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateApiKeyDto } from "./dto/update-api-key.dto";
export declare class ApiKeyService {
    private apiKeyModel;
    constructor(apiKeyModel: Model<ApiKeyDocument>);
    create(createApiKeyDto: CreateApiKeyDto): Promise<{
        apiKey: ApiKey;
        rawKey: string;
    }>;
    findAll(): Promise<ApiKey[]>;
    findOne(id: string): Promise<ApiKey>;
    findByKey(key: string): Promise<ApiKey | null>;
    update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<ApiKey>;
    remove(id: string): Promise<void>;
    updateScopes(id: string, scopes: {
        resource: string;
        permissions: string[];
    }[]): Promise<ApiKey>;
    deactivate(id: string): Promise<ApiKey>;
    activate(id: string): Promise<ApiKey>;
    regenerate(id: string): Promise<{
        apiKey: ApiKey;
        rawKey: string;
    }>;
    private generateApiKey;
    validateApiKeyScopes(apiKey: ApiKey, requiredScopes: {
        resource: string;
        permissions: string[];
    }[]): Promise<boolean>;
    getUsageStats(id: string): Promise<any>;
}
