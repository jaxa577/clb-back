"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const prisma_service_1 = require("../prisma/prisma.service");
let TelegramService = TelegramService_1 = class TelegramService {
    prisma;
    bot;
    logger = new common_1.Logger(TelegramService_1.name);
    constructor(prisma, bot) {
        this.prisma = prisma;
        this.bot = bot;
    }
    async onMyChatMember(ctx) {
        const update = ctx.update;
        const myChatMember = update.my_chat_member;
        if (!myChatMember)
            return;
        const chat = myChatMember.chat;
        const newStatus = myChatMember.new_chat_member.status;
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
            }
            else {
                await this.prisma.telegramChat.delete({
                    where: { chatId: chat.id.toString() },
                });
                this.logger.log(`Bot removed from chat ${chat.id.toString()} (${chat.title || 'no title'}) & deleted from DB.`);
            }
        }
        catch (error) {
            this.logger.error(`Error handling my_chat_member event: ${error.message}`);
        }
    }
    async broadcastLoad(load) {
        const activeChats = await this.prisma.telegramChat.findMany({
            where: { isActive: true },
        });
        if (!activeChats || activeChats.length === 0) {
            this.logger.log('No active telegram channels to broadcast too.');
            return;
        }
        const { originCountry, originCity, destinationCountry, destinationCity, weight, price, currency, truckType, displayId, id } = load;
        const escapeMd = (text) => {
            if (!text)
                return '';
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
                    ...telegraf_1.Markup.inlineKeyboard([
                        telegraf_1.Markup.button.url('Contact Owner', loadUrl)
                    ])
                });
                this.logger.log(`Broadcasted load ${displayId} to ${chat.chatId}`);
            }
            catch (error) {
                this.logger.error(`Failed to broadcast to ${chat.chatId}: ${error.message}`);
            }
        }
    }
};
exports.TelegramService = TelegramService;
__decorate([
    (0, nestjs_telegraf_1.On)('my_chat_member'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramService.prototype, "onMyChatMember", null);
__decorate([
    (0, event_emitter_1.OnEvent)('load.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramService.prototype, "broadcastLoad", null);
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    (0, common_1.Injectable)(),
    __param(1, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegraf_1.Telegraf])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map