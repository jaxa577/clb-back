import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto, userId: string) {
    const { loadId, role } = createApplicationDto;

    // Check if load exists and is open
    const load = await this.prisma.load.findUnique({
      where: { id: loadId },
    });

    if (!load) {
      throw new NotFoundException('Load not found');
    }

    if (load.status !== 'OPEN') {
      throw new BadRequestException('Load is not available for applications');
    }

    // Check if user is not the shipper
    if (load.shipperId === userId) {
      throw new ForbiddenException('You cannot apply to your own load');
    }

    // Check if user already applied to this load
    const existingApplication = await this.prisma.application.findUnique({
      where: {
        loadId_applicantId: {
          loadId,
          applicantId: userId,
        },
      },
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied to this load');
    }

    // Validate role (only DRIVER or BROKER can apply)
    if (role !== Role.DRIVER && role !== Role.BROKER) {
      throw new BadRequestException('Only drivers and brokers can apply to loads');
    }

    return this.prisma.application.create({
      data: {
        loadId,
        applicantId: userId,
        role,
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
        applicant: {
          select: {
            id: true,
            name: true,
            role: true,
            rating: true,
          },
        },
      },
    });
  }

  async accept(id: string, userId: string, userRole: Role) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        load: true,
        applicant: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Only shipper or admin can accept applications
    if (application.load.shipperId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only accept applications for your own loads');
    }

    if (application.status !== 'PENDING') {
      throw new BadRequestException('Application is not pending');
    }

    // Update application status and close the load
    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data: { status: 'ACCEPTED' },
      include: {
        load: {
          include: {
            shipper: true,
          },
        },
        applicant: true,
      },
    });

    // Update load status to IN_PROGRESS (archived/closed for new applications)
    await this.prisma.load.update({
      where: { id: application.loadId },
      data: { status: 'IN_PROGRESS' },
    });

    // Create deal
    await this.createDeal(updatedApplication);

    return updatedApplication;
  }

  async reject(id: string, userId: string, userRole: Role) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        load: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Only shipper or admin can reject applications
    if (application.load.shipperId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only reject applications for your own loads');
    }

    if (application.status !== 'PENDING') {
      throw new BadRequestException('Application is not pending');
    }

    return this.prisma.application.update({
      where: { id },
      data: { status: 'REJECTED' },
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
        applicant: {
          select: {
            id: true,
            name: true,
            role: true,
            rating: true,
          },
        },
      },
    });
  }

  private async createDeal(application: any) {
    const commission = application.applicant.role === Role.BROKER ? application.load.price * 0.05 : 0; // 5% commission for brokers

    return this.prisma.deal.create({
      data: {
        loadId: application.loadId,
        shipperId: application.load.shipperId,
        driverId: application.applicant.role === Role.DRIVER ? application.applicantId : null,
        brokerId: application.applicant.role === Role.BROKER ? application.applicantId : null,
        agreedPrice: application.load.price,
        commission,
      },
    });
  }

  async getUserApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { applicantId: userId },
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
