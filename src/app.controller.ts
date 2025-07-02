import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './auth/guards/api-key.guard';
import { RequireScopes } from './auth/decorators/require-scopes.decorator';
import { CurrentApiKey } from './auth/decorators/current-api-key.decorator';
import { ApiKey } from './api-key/schemas/api-key.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Protected route that requires API key with 'read' scope
  @Get('protected')
  @UseGuards(ApiKeyGuard)
  @RequireScopes('read')
  getProtectedData(@CurrentApiKey() apiKey: ApiKey): any {
    return {
      message: 'This is protected data',
      accessedBy: apiKey.name,
      scopes: apiKey.scopes,
      timestamp: new Date().toISOString(),
    };
  }

  // Protected route that requires API key with 'write' scope
  @Get('admin')
  @UseGuards(ApiKeyGuard)
  @RequireScopes('write', 'admin')
  getAdminData(@CurrentApiKey() apiKey: ApiKey): any {
    return {
      message: 'This is admin data',
      accessedBy: apiKey.name,
      scopes: apiKey.scopes,
      timestamp: new Date().toISOString(),
    };
  }

  // Protected route that requires API key with multiple scopes
  @Get('analytics')
  @UseGuards(ApiKeyGuard)
  @RequireScopes('read', 'analytics')
  getAnalytics(@CurrentApiKey() apiKey: ApiKey): any {
    return {
      message: 'Analytics data',
      data: {
        users: 1500,
        revenue: 50000,
        growth: 12.5,
      },
      accessedBy: apiKey.name,
      scopes: apiKey.scopes,
      timestamp: new Date().toISOString(),
    };
  }
} 