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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const prisma_service_1 = require("../prisma/prisma.service");
let TelegramService = TelegramService_1 = class TelegramService {
    prisma;
    logger = new common_1.Logger(TelegramService_1.name);
    bot = null;
    constructor(prisma) {
        this.prisma = prisma;
        this.initializeBot();
    }
    initializeBot() {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            this.logger.warn('TELEGRAM_BOT_TOKEN not found in environment variables. Telegram notifications will be disabled.');
            return;
        }
        try {
            this.bot = new node_telegram_bot_api_1.default(token, { polling: false });
            this.logger.log('Telegram bot initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Telegram bot', error);
        }
    }
    async sendNotification(chatId, message) {
        if (!this.bot) {
            this.logger.warn('Telegram bot not initialized, skipping notification');
            return false;
        }
        try {
            await this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send Telegram notification to ${chatId}:`, error);
            return false;
        }
    }
    async notifyNewLoad(load, shipperId) {
        const drivers = await this.prisma.user.findMany({
            where: {
                role: 'DRIVER',
                telegramChatId: { not: null },
            },
        });
        const message = `
<b>🚚 New Load Available!</b>

<b>ID:</b> ${load.displayId || load.id}
<b>Route:</b> ${load.originCity}, ${load.originCountry} → ${load.destinationCity}, ${load.destinationCountry}
<b>Cargo:</b> ${load.cargoType}
<b>Weight:</b> ${load.weight} kg
<b>Price:</b> ${load.price} ${load.currency}
<b>Truck Type:</b> ${load.truckType}
<b>Status:</b> ${load.status}

View details in the app!
    `.trim();
        const promises = drivers
            .filter((driver) => driver.telegramChatId !== null)
            .map((driver) => this.sendNotification(driver.telegramChatId, message));
        await Promise.allSettled(promises);
    }
    async notifyApplicationStatus(application, loadId, status) {
        const load = await this.prisma.load.findUnique({
            where: { id: loadId },
        });
        const applicant = await this.prisma.user.findUnique({
            where: { id: application.applicantId },
        });
        if (!applicant?.telegramChatId || !load)
            return;
        const statusEmoji = status === 'ACCEPTED' ? '✅' : '❌';
        const statusText = status === 'ACCEPTED' ? 'Accepted' : 'Rejected';
        const message = `
<b>${statusEmoji} Application ${statusText}</b>

<b>Load ID:</b> ${load.displayId || load.id}
<b>Route:</b> ${load.originCity}, ${load.originCountry} → ${load.destinationCity}, ${load.destinationCountry}

Your application has been ${statusText.toLowerCase()}.
    `.trim();
        await this.sendNotification(applicant.telegramChatId, message);
    }
    async notifyNewApplication(application, loadId) {
        const load = await this.prisma.load.findUnique({
            where: { id: loadId },
            include: {
                shipper: true,
            },
        });
        const applicant = await this.prisma.user.findUnique({
            where: { id: application.applicantId },
        });
        if (!load?.shipper.telegramChatId || !applicant)
            return;
        const message = `
<b>📋 New Application Received!</b>

<b>Load ID:</b> ${load.displayId || load.id}
<b>Route:</b> ${load.originCity}, ${load.originCountry} → ${load.destinationCity}, ${load.destinationCountry}
<b>Applicant:</b> ${applicant.name}
<b>Role:</b> ${applicant.role}
<b>Rating:</b> ${applicant.rating || 'N/A'} ⭐

Check the app to review the application.
    `.trim();
        await this.sendNotification(load.shipper.telegramChatId, message);
    }
    async notifyLoadStatusChange(loadId, oldStatus, newStatus) {
        const load = await this.prisma.load.findUnique({
            where: { id: loadId },
            include: {
                shipper: true,
                applications: {
                    where: { status: 'ACCEPTED' },
                    include: {
                        applicant: true,
                    },
                },
            },
        });
        if (!load)
            return;
        const statusEmojis = {
            OPEN: '📢',
            IN_PROGRESS: '🚚',
            COMPLETED: '✅',
            CANCELLED: '❌',
            ARCHIVED: '📦',
        };
        const message = `
<b>${statusEmojis[newStatus] || '📊'} Load Status Updated</b>

<b>Load ID:</b> ${load.displayId || load.id}
<b>Route:</b> ${load.originCity}, ${load.originCountry} → ${load.destinationCity}, ${load.destinationCountry}
<b>Old Status:</b> ${oldStatus}
<b>New Status:</b> ${newStatus}
    `.trim();
        const notificationPromises = [];
        if (load.shipper.telegramChatId) {
            notificationPromises.push(this.sendNotification(load.shipper.telegramChatId, message));
        }
        load.applications.forEach((app) => {
            if (app.applicant.telegramChatId) {
                notificationPromises.push(this.sendNotification(app.applicant.telegramChatId, message));
            }
        });
        await Promise.allSettled(notificationPromises);
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map