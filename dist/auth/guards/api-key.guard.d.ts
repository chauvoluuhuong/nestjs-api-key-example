import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyService } from '../../api-key/api-key.service';
export declare class ApiKeyGuard implements CanActivate {
    private apiKeyService;
    private reflector;
    constructor(apiKeyService: ApiKeyService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractApiKeyFromHeader;
}
