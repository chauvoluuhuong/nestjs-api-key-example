import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiKeyGuard } from "./auth/guards/api-key.guard";
import {
  RequireRead,
  RequireResource,
  RequireLegacyScopes,
} from "./auth/decorators/require-scopes.decorator";
import { Permission } from "./auth/enums/permission.enum";
import { CurrentApiKey } from "./auth/decorators/current-api-key.decorator";
import { ApiKey } from "./api-key/schemas/api-key.schema";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Protected route that requires API key with READ permission on any resource
  @Get("protected")
  @UseGuards(ApiKeyGuard)
  @RequireRead("*")
  getProtectedData(@CurrentApiKey() apiKey: ApiKey): any {
    return {
      message: "This is protected data",
      accessedBy: apiKey.name,
      scopes: apiKey.scopes,
      timestamp: new Date().toISOString(),
    };
  }

  // Protected route that requires API key with WRITE and DELETE permissions on admin resource
  @Get("admin")
  @UseGuards(ApiKeyGuard)
  @RequireResource("admin", Permission.WRITE, Permission.DELETE)
  getAdminData(@CurrentApiKey() apiKey: ApiKey): any {
    return {
      message: "This is admin data",
      accessedBy: apiKey.name,
      scopes: apiKey.scopes,
      timestamp: new Date().toISOString(),
    };
  }

  // Protected route that requires API key with READ permission on analytics resource
  @Get("analytics")
  @UseGuards(ApiKeyGuard)
  @RequireRead("analytics")
  getAnalytics(@CurrentApiKey() apiKey: ApiKey): any {
    return {
      message: "Analytics data",
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
