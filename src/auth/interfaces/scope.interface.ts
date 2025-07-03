import { Permission } from "../enums/permission.enum";

export interface ApiKeyScope {
  resource: string;
  permissions: Permission[];
}

export interface ScopeValidationResult {
  hasAccess: boolean;
  missingScopes?: {
    resource: string;
    missingPermissions: Permission[];
  }[];
}
