import { Permission } from "../enums/permission.enum";
export declare class ApiKeyScopeDto {
    resource: string;
    permissions: Permission[];
}
export declare class RequiredScopeDto {
    resource: string;
    permission: Permission;
}
