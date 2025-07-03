import { IsEnum, IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Permission } from "../enums/permission.enum";

export class ApiKeyScopeDto {
  @IsString()
  resource!: string;

  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions!: Permission[];
}

export class RequiredScopeDto {
  @IsString()
  resource!: string;

  @IsEnum(Permission)
  permission!: Permission;
}
