import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "NestJS API Key Management System is running!";
  }
}
