import { Module } from '@nestjs/common';
import { ApiKeyModule } from '../api-key/api-key.module';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
  imports: [ApiKeyModule],
  providers: [ApiKeyGuard],
  exports: [ApiKeyGuard],
})
export class AuthModule {} 