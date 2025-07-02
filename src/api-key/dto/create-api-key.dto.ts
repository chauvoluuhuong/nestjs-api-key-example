import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateApiKeyDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];

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
