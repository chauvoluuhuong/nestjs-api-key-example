import { AppService } from "./app.service";
import { ApiKey } from "./api-key/schemas/api-key.schema";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getProtectedData(apiKey: ApiKey): any;
    getAdminData(apiKey: ApiKey): any;
    getAnalytics(apiKey: ApiKey): any;
}
