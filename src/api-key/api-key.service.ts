import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { ApiKey, ApiKeyDocument } from "./schemas/api-key.schema";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateApiKeyDto } from "./dto/update-api-key.dto";

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKeyDocument>
  ) {}

  async create(
    createApiKeyDto: CreateApiKeyDto
  ): Promise<{ apiKey: ApiKey; rawKey: string }> {
    const rawKey = this.generateApiKey();
    const hashedKey = await bcrypt.hash(rawKey, 10);

    const existingApiKey = await this.apiKeyModel
      .findOne({
        name: createApiKeyDto.name,
      })
      .exec();

    if (existingApiKey) {
      throw new ConflictException("API key with this name already exists");
    }

    const apiKey = new this.apiKeyModel({
      ...createApiKeyDto,
      key: hashedKey,
      scopes: createApiKeyDto.scopes || ["read"],
    });

    const savedApiKey = await apiKey.save();

    // Return both the saved API key (without the hashed key) and the raw key
    const result = savedApiKey.toObject();
    delete (result as any).key;

    return {
      apiKey: result as ApiKey,
      rawKey: rawKey,
    };
  }

  async findAll(): Promise<ApiKey[]> {
    const apiKeys = await this.apiKeyModel
      .find()
      .select("-key") // Exclude the hashed key from results
      .exec();

    return apiKeys;
  }

  async findOne(id: string): Promise<ApiKey> {
    const apiKey = await this.apiKeyModel.findById(id).select("-key").exec();

    if (!apiKey) {
      throw new NotFoundException("API key not found");
    }

    return apiKey;
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    const apiKeys = await this.apiKeyModel.find({ isActive: true }).exec();

    for (const apiKey of apiKeys) {
      const isValid = await bcrypt.compare(key, apiKey.key);
      if (isValid) {
        // Update last used timestamp and usage count
        await this.apiKeyModel
          .findByIdAndUpdate(apiKey._id, {
            lastUsedAt: new Date(),
            $inc: { usageCount: 1 },
          })
          .exec();

        return apiKey;
      }
    }

    return null;
  }

  async update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<ApiKey> {
    const apiKey = await this.apiKeyModel
      .findByIdAndUpdate(id, updateApiKeyDto, { new: true })
      .select("-key")
      .exec();

    if (!apiKey) {
      throw new NotFoundException("API key not found");
    }

    return apiKey;
  }

  async remove(id: string): Promise<void> {
    const result = await this.apiKeyModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException("API key not found");
    }
  }

  async updateScopes(id: string, scopes: string[]): Promise<ApiKey> {
    const apiKey = await this.apiKeyModel
      .findByIdAndUpdate(id, { scopes }, { new: true })
      .select("-key")
      .exec();

    if (!apiKey) {
      throw new NotFoundException("API key not found");
    }

    return apiKey;
  }

  async deactivate(id: string): Promise<ApiKey> {
    return this.update(id, { isActive: false });
  }

  async activate(id: string): Promise<ApiKey> {
    return this.update(id, { isActive: true });
  }

  async regenerate(id: string): Promise<{ apiKey: ApiKey; rawKey: string }> {
    const existingApiKey = await this.apiKeyModel.findById(id).exec();

    if (!existingApiKey) {
      throw new NotFoundException("API key not found");
    }

    const rawKey = this.generateApiKey();
    const hashedKey = await bcrypt.hash(rawKey, 10);

    const updatedApiKey = await this.apiKeyModel
      .findByIdAndUpdate(
        id,
        {
          key: hashedKey,
          usageCount: 0,
          lastUsedAt: null,
        },
        { new: true }
      )
      .select("-key")
      .exec();

    return {
      apiKey: updatedApiKey as ApiKey,
      rawKey: rawKey,
    };
  }

  private generateApiKey(): string {
    const prefix = process.env.API_KEY_PREFIX || "ak_";
    const randomString = uuidv4().replace(/-/g, "");
    return `${prefix}${randomString}`;
  }

  async validateApiKeyScopes(
    apiKey: ApiKey,
    requiredScopes: string[]
  ): Promise<boolean> {
    if (!requiredScopes || requiredScopes.length === 0) {
      return true;
    }

    // Check if the API key has all required scopes
    return requiredScopes.every((scope) => apiKey.scopes.includes(scope));
  }

  async getUsageStats(id: string): Promise<any> {
    const apiKey = await this.apiKeyModel.findById(id).select("-key").exec();

    if (!apiKey) {
      throw new NotFoundException("API key not found");
    }

    return {
      name: apiKey.name,
      usageCount: apiKey.usageCount,
      lastUsedAt: apiKey.lastUsedAt,
      createdAt: apiKey.createdAt,
      isActive: apiKey.isActive,
      scopes: apiKey.scopes,
    };
  }
}
