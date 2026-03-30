import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
        environment: string;
    };
    getDatabaseHealth(): Promise<{
        status: string;
        database: string;
        userCount: number;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        database: string;
        error: any;
        timestamp: string;
        userCount?: undefined;
    }>;
    getConfigHealth(): {
        status: string;
        environment: string;
        databaseConfigured: boolean;
        jwtSecretConfigured: boolean;
        jwtRefreshSecretConfigured: boolean;
        corsOrigin: string;
        port: string;
        timestamp: string;
    };
}
