import { PartialType } from '@nestjs/mapped-types';
import { CreateApiKeyDto } from './create-api-key.dto';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateApiKeyDto extends PartialType(CreateApiKeyDto) {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 