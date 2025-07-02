import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiKeyService } from "./api-key.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateApiKeyDto } from "./dto/update-api-key.dto";

@Controller("api-keys")
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  async create(@Body() createApiKeyDto: CreateApiKeyDto) {
    const result = await this.apiKeyService.create(createApiKeyDto);
    return {
      message: "API key created successfully",
      apiKey: result.apiKey,
      key: result.rawKey, // Only shown once during creation
      warning: "Store this key securely. It will not be shown again.",
    };
  }

  @Get()
  async findAll() {
    const apiKeys = await this.apiKeyService.findAll();
    return {
      message: "API keys retrieved successfully",
      data: apiKeys,
      count: apiKeys.length,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const apiKey = await this.apiKeyService.findOne(id);
    return {
      message: "API key retrieved successfully",
      data: apiKey,
    };
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto
  ) {
    const apiKey = await this.apiKeyService.update(id, updateApiKeyDto);
    return {
      message: "API key updated successfully",
      data: apiKey,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    await this.apiKeyService.remove(id);
    return {
      message: "API key deleted successfully",
    };
  }

  @Patch(":id/scopes")
  async updateScopes(
    @Param("id") id: string,
    @Body() body: { scopes: { resource: string; permissions: string[] }[] }
  ) {
    const apiKey = await this.apiKeyService.updateScopes(id, body.scopes);
    return {
      message: "API key scopes updated successfully",
      data: apiKey,
    };
  }

  @Patch(":id/deactivate")
  async deactivate(@Param("id") id: string) {
    const apiKey = await this.apiKeyService.deactivate(id);
    return {
      message: "API key deactivated successfully",
      data: apiKey,
    };
  }

  @Patch(":id/activate")
  async activate(@Param("id") id: string) {
    const apiKey = await this.apiKeyService.activate(id);
    return {
      message: "API key activated successfully",
      data: apiKey,
    };
  }

  @Post(":id/regenerate")
  async regenerate(@Param("id") id: string) {
    const result = await this.apiKeyService.regenerate(id);
    return {
      message: "API key regenerated successfully",
      apiKey: result.apiKey,
      key: result.rawKey,
      warning: "Store this key securely. It will not be shown again.",
    };
  }

  @Get(":id/usage")
  async getUsageStats(@Param("id") id: string) {
    const stats = await this.apiKeyService.getUsageStats(id);
    return {
      message: "Usage statistics retrieved successfully",
      data: stats,
    };
  }
}
