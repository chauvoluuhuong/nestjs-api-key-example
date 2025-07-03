import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ApiKeyService } from "../../api-key/api-key.service";
import { ScopeValidationService } from "../services/scope-validation.service";
export declare class ApiKeyGuard implements CanActivate {
    private apiKeyService;
    private reflector;
    private scopeValidationService;
    constructor(apiKeyService: ApiKeyService, reflector: Reflector, scopeValidationService: ScopeValidationService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractApiKeyFromHeader;
}
