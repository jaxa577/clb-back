import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'SNG LoadBoard API is running!';
  }

  async checkDatabaseHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const userCount = await this.prisma.user.count();
      return {
        status: 'ok',
        database: 'connected',
        userCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
