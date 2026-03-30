import { Context, Telegraf } from 'telegraf';
import { PrismaService } from '../prisma/prisma.service';
export declare class TelegramService {
    private readonly prisma;
    private readonly bot;
    private readonly logger;
    constructor(prisma: PrismaService, bot: Telegraf<Context>);
    onMyChatMember(ctx: Context): Promise<void>;
    broadcastLoad(load: any): Promise<void>;
}
