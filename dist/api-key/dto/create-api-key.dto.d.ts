import { ApiKeyScopeDto } from "../../auth/dto/scope.dto";
export declare class CreateApiKeyDto {
    name: string;
    description?: string;
    scopes?: ApiKeyScopeDto[];
    isActive?: boolean;
    expiresAt?: Date;
    rateLimit?: number;
    metadata?: Record<string, any>;
}
