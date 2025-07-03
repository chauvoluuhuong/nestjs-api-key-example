import { Module } from "@nestjs/common";
import { ApiKeyModule } from "../api-key/api-key.module";
import { ApiKeyGuard } from "./guards/api-key.guard";
import { ScopeValidationService } from "./services/scope-validation.service";

@Module({
  imports: [ApiKeyModule],
  providers: [ApiKeyGuard, ScopeValidationService],
  exports: [ApiKeyGuard, ScopeValidationService],
})
export class AuthModule {}
