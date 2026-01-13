import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Role } from '@prisma/client';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private messagesService: MessagesService,
  ) {}

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

    // Update application status
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

    // Create deal
    await this.createDeal(updatedApplication);

    // Send automatic acceptance message
    const loadDetails = `${application.load.originCity} → ${application.load.destinationCity}`;
    const acceptMessage = `Ваша заявка на груз "${loadDetails}" одобрена! Пожалуйста, свяжитесь с нами для обсуждения деталей.`;

    await this.messagesService.sendMessage(
      userId, // shipper/broker sending the message
      application.applicantId, // driver/broker receiving
      acceptMessage
    );

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

    const updatedApplication = await this.prisma.application.update({
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

    // Send automatic rejection message
    const loadDetails = `${application.load.originCity} → ${application.load.destinationCity}`;
    const rejectMessage = `Спасибо за ваш интерес к грузу "${loadDetails}". К сожалению, мы приняли решение работать с другим исполнителем. Надеемся на сотрудничество в будущем.`;

    await this.messagesService.sendMessage(
      userId, // shipper/broker sending the message
      application.applicantId, // driver/broker receiving
      rejectMessage
    );

    return updatedApplication;
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
