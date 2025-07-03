import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ApiKeyDocument = ApiKey & Document;

@Schema({ timestamps: true })
export class ApiKey {
  @Prop({ required: true, unique: true })
  key!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({
    type: [
      {
        resource: { type: String, required: true },
        permissions: { type: [String], required: true },
      },
    ],
    default: [],
  })
  scopes!: { resource: string; permissions: string[] }[];

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  expiresAt?: Date;

  @Prop()
  lastUsedAt?: Date;

  @Prop({ default: 0 })
  usageCount!: number;

  @Prop()
  rateLimit?: number;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
