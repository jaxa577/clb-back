import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Update, Ctx, On, InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf, Markup } from 'telegraf';
import { PrismaService } from '../prisma/prisma.service';

@Update()
@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectBot() private readonly bot: Telegraf<Context>
  ) {}

  @On('my_chat_member')
  async onMyChatMember(@Ctx() ctx: Context) {
    const update: any = ctx.update;
    const myChatMember = update.my_chat_member;
    
    if (!myChatMember) return;

    const chat = myChatMember.chat;
    const newStatus = myChatMember.new_chat_member.status;

    // Active status corresponds to member or administrator when added to a group/channel
    const isActive = newStatus === 'member' || newStatus === 'administrator';

    try {
        if (isActive) {
            await this.prisma.telegramChat.upsert({
                where: { chatId: chat.id.toString() },
                update: {
                    title: chat.title || null,
                    type: chat.type,
                    isActive: true,
                },
                create: {
                    chatId: chat.id.toString(),
                    title: chat.title || null,
                    type: chat.type,
                    isActive: true,
                },
            });
            this.logger.log(`Bot added to chat ${chat.id.toString()} (${chat.title || 'no title'})`);
        } else {
            // Bot removed or kicked
            await this.prisma.telegramChat.delete({
                where: { chatId: chat.id.toString() },
            });
            this.logger.log(`Bot removed from chat ${chat.id.toString()} (${chat.title || 'no title'}) & deleted from DB.`);
        }
    } catch (error: any) {
        this.logger.error(`Error handling my_chat_member event: ${error.message}`);
    }
  }

  @OnEvent('load.created')
  async broadcastLoad(load: any) {
    const activeChats = await this.prisma.telegramChat.findMany({
      where: { isActive: true },
    });

    if (!activeChats || activeChats.length === 0) {
      this.logger.log('No active telegram channels to broadcast too.');
      return;
    }

    const { originCountry, originCity, destinationCountry, destinationCity, weight, price, currency, truckType, displayId, id } = load;

    // MarkdownV2 Escaping helper
    const escapeMd = (text: string) => {
      if (!text) return '';
      return text.toString().replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
    };

    const origin = escapeMd(`${originCity || ''}, ${originCountry || ''}`.trim().replace(/^, |, $/g, ''));
    const destination = escapeMd(`${destinationCity || ''}, ${destinationCountry || ''}`.trim().replace(/^, |, $/g, ''));
    const safeWeight = escapeMd(weight ? `${weight} tons` : 'N/A');
    const safePrice = escapeMd(price ? `${price} ${currency || 'USD'}` : 'Negotiable');
    const safeTruck = escapeMd(truckType || 'N/A');
    const safeDisplayId = escapeMd(displayId || id.substring(0, 8));

    const message = `
🚨 *New Load Available\\!* \\(\\#${safeDisplayId}\\)

📍 *Origin:* ${origin || 'N\\/A'}
🎯 *Destination:* ${destination || 'N\\/A'}
⚖️ *Weight:* ${safeWeight}
💰 *Price:* ${safePrice}
🚜 *Equipment Type:* ${safeTruck}
    `.trim();

    const loadUrl = `https://sngloadboard.com/loads/${id}`;

    for (const chat of activeChats) {
      try {
        await this.bot.telegram.sendMessage(chat.chatId, message, {
          parse_mode: 'MarkdownV2',
          ...Markup.inlineKeyboard([
            Markup.button.url('Contact Owner', loadUrl)
          ])
        });
        this.logger.log(`Broadcasted load ${displayId} to ${chat.chatId}`);
      } catch (error: any) {
        this.logger.error(`Failed to broadcast to ${chat.chatId}: ${error.message}`);
      }
    }
  }
}
