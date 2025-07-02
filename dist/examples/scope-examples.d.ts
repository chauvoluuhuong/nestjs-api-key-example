import { ApiKeyScopeDto } from "../auth/dto/scope.dto";
export declare const userManagementScopes: ApiKeyScopeDto[];
export declare const adminScopes: ApiKeyScopeDto[];
export declare const analyticsReadOnlyScopes: ApiKeyScopeDto[];
export declare const contentManagementScopes: ApiKeyScopeDto[];
export declare const thirdPartyIntegrationScopes: ApiKeyScopeDto[];
export declare const exampleApiKeyRequests: {
    userApiKey: {
        name: string;
        description: string;
        scopes: ApiKeyScopeDto[];
        expiresAt: Date;
    };
    adminApiKey: {
        name: string;
        description: string;
        scopes: ApiKeyScopeDto[];
    };
    analyticsKey: {
        name: string;
        description: string;
        scopes: ApiKeyScopeDto[];
        expiresAt: Date;
    };
    contentKey: {
        name: string;
        description: string;
        scopes: ApiKeyScopeDto[];
    };
    integrationKey: {
        name: string;
        description: string;
        scopes: ApiKeyScopeDto[];
        expiresAt: Date;
    };
};
