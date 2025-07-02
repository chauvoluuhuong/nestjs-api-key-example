export declare class CreateApiKeyDto {
    name: string;
    description?: string;
    scopes?: string[];
    isActive?: boolean;
    expiresAt?: Date;
    rateLimit?: number;
    metadata?: Record<string, any>;
}
