import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async getUserDeals(userId: string) {
    return this.prisma.deal.findMany({
      where: {
        OR: [
          { shipperId: userId },
          { driverId: userId },
          { brokerId: userId },
        ],
      },
      include: {
        load: {
          include: {
            shipper: {
              select: {
                id: true,
                name: true,
                rating: true,
              },
            },
          },
        },
        shipper: {
          select: {
            id: true,
            name: true,
            rating: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            rating: true,
          },
        },
        broker: {
          select: {
            id: true,
            name: true,
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async confirmDeal(loadId: string, userId: string) {
    // This would typically involve payment processing
    // For now, just mark the deal as completed
    const deal = await this.prisma.deal.findFirst({
      where: {
        loadId,
        OR: [
          { shipperId: userId },
          { driverId: userId },
          { brokerId: userId },
        ],
      },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return this.prisma.deal.update({
      where: { id: deal.id },
      data: { status: 'COMPLETED' },
      include: {
        load: true,
        shipper: true,
        driver: true,
        broker: true,
      },
    });
  }
}
