import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyService } from '../../api-key/api-key.service';
import { REQUIRE_SCOPES_KEY } from '../decorators/require-scopes.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private apiKeyService: ApiKeyService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    const validApiKey = await this.apiKeyService.findByKey(apiKey);

    if (!validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (!validApiKey.isActive) {
      throw new UnauthorizedException('API key is inactive');
    }

    // Check if API key has expired
    if (validApiKey.expiresAt && new Date() > validApiKey.expiresAt) {
      throw new UnauthorizedException('API key has expired');
    }

    // Get required scopes from decorator
    const requiredScopes = this.reflector.getAllAndOverride<string[]>(REQUIRE_SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Validate scopes if required
    if (requiredScopes && requiredScopes.length > 0) {
      const hasValidScopes = await this.apiKeyService.validateApiKeyScopes(
        validApiKey,
        requiredScopes,
      );

      if (!hasValidScopes) {
        throw new ForbiddenException(
          `Insufficient scopes. Required: ${requiredScopes.join(', ')}. Available: ${validApiKey.scopes.join(', ')}`,
        );
      }
    }

    // Attach the API key to the request for use in controllers
    request.apiKey = validApiKey;

    return true;
  }

  private extractApiKeyFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    const apiKeyHeader = request.headers['x-api-key'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    return null;
  }
} 