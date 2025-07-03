import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiKeyScopeDto } from "../../auth/dto/scope.dto";

export class CreateApiKeyDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApiKeyScopeDto)
  scopes?: ApiKeyScopeDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;

  @IsOptional()
  @IsNumber()
  rateLimit?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
