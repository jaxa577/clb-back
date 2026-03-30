import { PrismaService } from '../prisma/prisma.service';
export declare class TelegramService {
    private prisma;
    private readonly logger;
    private bot;
    constructor(prisma: PrismaService);
    private initializeBot;
    sendNotification(chatId: string | number, message: string): Promise<boolean>;
    notifyNewLoad(load: any, shipperId: string): Promise<void>;
    notifyApplicationStatus(application: any, loadId: string, status: string): Promise<void>;
    notifyNewApplication(application: any, loadId: string): Promise<void>;
    notifyLoadStatusChange(loadId: string, oldStatus: string, newStatus: string): Promise<void>;
}
