import { Document } from "mongoose";
export type ApiKeyDocument = ApiKey & Document;
export declare class ApiKey {
    key: string;
    name: string;
    description?: string;
    scopes: {
        resource: string;
        permissions: string[];
    }[];
    isActive: boolean;
    expiresAt?: Date;
    lastUsedAt?: Date;
    usageCount: number;
    rateLimit?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ApiKeySchema: import("mongoose").Schema<ApiKey, import("mongoose").Model<ApiKey, any, any, any, Document<unknown, any, ApiKey> & ApiKey & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ApiKey, Document<unknown, {}, import("mongoose").FlatRecord<ApiKey>> & import("mongoose").FlatRecord<ApiKey> & {
    _id: import("mongoose").Types.ObjectId;
}>;
