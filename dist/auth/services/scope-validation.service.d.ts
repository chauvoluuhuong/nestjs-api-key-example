import { Permission } from "../enums/permission.enum";
import { ApiKeyScope, ScopeValidationResult } from "../interfaces/scope.interface";
export declare class ScopeValidationService {
    validateScopes(apiKeyScopes: ApiKeyScope[], requiredResource: string, requiredPermissions: Permission[]): ScopeValidationResult;
    validateMultipleScopes(apiKeyScopes: ApiKeyScope[], requirements: {
        resource: string;
        permissions: Permission[];
    }[]): ScopeValidationResult;
    convertLegacyScopes(legacyScopes: string[]): ApiKeyScope[];
    private addPermissionToResource;
    formatScopesForDisplay(scopes: ApiKeyScope[]): string[];
}
