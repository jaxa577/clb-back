import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: TelegramBot | null = null;

  constructor(private prisma: PrismaService) {
    this.initializeBot();
  }

  private initializeBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN not found in environment variables. Telegram notifications will be disabled.');
      return;
    }

    try {
      this.bot = new TelegramBot(token, { polling: false });
      this.logger.log('Telegram bot initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Telegram bot', error);
    }
  }

  async sendNotification(chatId: string | number, message: string): Promise<boolean> {
    if (!this.bot) {
      this.logger.warn('Telegram bot not initialized, skipping notification');
      return false;
    }

    try {
      await this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send Telegram notification to ${chatId}:`, error);
      return false;
    }
  }

  async notifyNewLoad(load: any, shipperId: string) {
    // Find users who want to be notified about new loads
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

    const promises = drivers.map((driver) =>
      this.sendNotification(driver.telegramChatId, message)
    );

    await Promise.allSettled(promises);
  }

  async notifyApplicationStatus(application: any, loadId: string, status: string) {
    const load = await this.prisma.load.findUnique({
      where: { id: loadId },
    });

    const applicant = await this.prisma.user.findUnique({
      where: { id: application.applicantId },
    });

    if (!applicant?.telegramChatId) return;

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

  async notifyNewApplication(application: any, loadId: string) {
    const load = await this.prisma.load.findUnique({
      where: { id: loadId },
      include: {
        shipper: true,
      },
    });

    const applicant = await this.prisma.user.findUnique({
      where: { id: application.applicantId },
    });

    if (!load.shipper.telegramChatId) return;

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

  async notifyLoadStatusChange(loadId: string, oldStatus: string, newStatus: string) {
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

    if (!load) return;

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

    // Notify shipper
    if (load.shipper.telegramChatId) {
      notificationPromises.push(
        this.sendNotification(load.shipper.telegramChatId, message)
      );
    }

    // Notify accepted drivers/brokers
    load.applications.forEach((app) => {
      if (app.applicant.telegramChatId) {
        notificationPromises.push(
          this.sendNotification(app.applicant.telegramChatId, message)
        );
      }
    });

    await Promise.allSettled(notificationPromises);
  }
}
