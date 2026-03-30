import { PrismaService } from './prisma/prisma.service';
export declare class AppService {
    private prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
    checkDatabaseHealth(): Promise<{
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
}
