import { SetMetadata } from '@nestjs/common';

export const REQUIRE_SCOPES_KEY = 'requireScopes';
export const RequireScopes = (...scopes: string[]) => SetMetadata(REQUIRE_SCOPES_KEY, scopes); 