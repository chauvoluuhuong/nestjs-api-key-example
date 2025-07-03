import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ApiKeyService } from "../../api-key/api-key.service";
import { ScopeValidationService } from "../services/scope-validation.service";
import {
  REQUIRE_SCOPES_KEY,
  RequiredScope,
} from "../decorators/require-scopes.decorator";
import { Permission } from "../enums/permission.enum";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private apiKeyService: ApiKeyService,
    private reflector: Reflector,
    private scopeValidationService: ScopeValidationService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      throw new UnauthorizedException("API key is required");
    }

    const validApiKey = await this.apiKeyService.findByKey(apiKey);

    if (!validApiKey) {
      throw new UnauthorizedException("Invalid API key");
    }

    if (!validApiKey.isActive) {
      throw new UnauthorizedException("API key is inactive");
    }

    // Check if API key has expired
    if (validApiKey.expiresAt && new Date() > validApiKey.expiresAt) {
      throw new UnauthorizedException("API key has expired");
    }

    // Get required scopes from decorator
    const requiredScopes = this.reflector.getAllAndOverride<RequiredScope[]>(
      REQUIRE_SCOPES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // Validate scopes if required
    if (requiredScopes && requiredScopes.length > 0) {
      // Convert API key scopes to the expected format for validation
      const apiKeyScopes = validApiKey.scopes.map((scope) => ({
        resource: scope.resource,
        permissions: scope.permissions as Permission[],
      }));

      // Convert required scopes to validation format
      const requirements = requiredScopes.map((scope) => ({
        resource: scope.resource,
        permissions: scope.permissions,
      }));

      const validationResult =
        this.scopeValidationService.validateMultipleScopes(
          apiKeyScopes,
          requirements
        );

      if (!validationResult.hasAccess) {
        const missingScopes = validationResult.missingScopes || [];
        const formattedMissing = missingScopes
          .map(
            (scope) => `${scope.resource}:${scope.missingPermissions.join(",")}`
          )
          .join(", ");

        const availableScopes =
          this.scopeValidationService.formatScopesForDisplay(apiKeyScopes);

        throw new ForbiddenException(
          `Insufficient scopes. Missing: ${formattedMissing}. Available: ${availableScopes.join(
            ", "
          )}`
        );
      }
    }

    // Attach the API key to the request for use in controllers
    request.apiKey = validApiKey;

    return true;
  }

  private extractApiKeyFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    const apiKeyHeader = request.headers["x-api-key"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    return null;
  }
}
