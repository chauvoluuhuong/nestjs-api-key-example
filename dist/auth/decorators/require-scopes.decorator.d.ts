import { Permission } from "../enums/permission.enum";
export declare const REQUIRE_SCOPES_KEY = "requireScopes";
export interface RequiredScope {
    resource: string;
    permissions: Permission[];
}
export declare const RequireScopes: (requirements: RequiredScope[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireResource: (resource: string, ...permissions: Permission[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireRead: (resource: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireWrite: (resource: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireUpdate: (resource: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireDelete: (resource: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireLegacyScopes: (...scopes: string[]) => import("@nestjs/common").CustomDecorator<string>;
