import { ApiKeyService } from "./api-key.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateApiKeyDto } from "./dto/update-api-key.dto";
export declare class ApiKeyController {
    private readonly apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    create(createApiKeyDto: CreateApiKeyDto): Promise<{
        message: string;
        apiKey: import("./schemas/api-key.schema").ApiKey;
        key: string;
        warning: string;
    }>;
    findAll(): Promise<{
        message: string;
        data: import("./schemas/api-key.schema").ApiKey[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: import("./schemas/api-key.schema").ApiKey;
    }>;
    update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<{
        message: string;
        data: import("./schemas/api-key.schema").ApiKey;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateScopes(id: string, body: {
        scopes: {
            resource: string;
            permissions: string[];
        }[];
    }): Promise<{
        message: string;
        data: import("./schemas/api-key.schema").ApiKey;
    }>;
    deactivate(id: string): Promise<{
        message: string;
        data: import("./schemas/api-key.schema").ApiKey;
    }>;
    activate(id: string): Promise<{
        message: string;
        data: import("./schemas/api-key.schema").ApiKey;
    }>;
    regenerate(id: string): Promise<{
        message: string;
        apiKey: import("./schemas/api-key.schema").ApiKey;
        key: string;
        warning: string;
    }>;
    getUsageStats(id: string): Promise<{
        message: string;
        data: any;
    }>;
}
