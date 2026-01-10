import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { Role } from '@prisma/client';

@Injectable()
export class LoadsService {
  constructor(private prisma: PrismaService) {}

  async create(createLoadDto: CreateLoadDto, userId: string) {
    return this.prisma.load.create({
      data: {
        ...createLoadDto,
        shipperId: userId,
        loadingDate: new Date(createLoadDto.loadingDate),
      },
      include: {
        shipper: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
          },
        },
      },
    });
  }

  async findAll(query: any = {}) {
    const { page = 1, limit = 10, ...filters } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      status: 'OPEN', // Only show open loads by default
      ...filters,
    };

    const [loads, total] = await Promise.all([
      this.prisma.load.findMany({
        where,
        include: {
          shipper: {
            select: {
              id: true,
              name: true,
              rating: true,
            },
          },
          applications: {
            select: {
              id: true,
              applicant: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                  rating: true,
                },
              },
              status: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.load.count({ where }),
    ]);

    return {
      loads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async findOne(id: string) {
    const load = await this.prisma.load.findUnique({
      where: { id },
      include: {
        shipper: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            rating: true,
          },
        },
        applications: {
          include: {
            applicant: {
              select: {
                id: true,
                name: true,
                role: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!load) {
      throw new NotFoundException('Load not found');
    }

    return load;
  }

  async update(id: string, updateLoadDto: UpdateLoadDto, userId: string, userRole: Role) {
    const load = await this.prisma.load.findUnique({
      where: { id },
    });

    if (!load) {
      throw new NotFoundException('Load not found');
    }

    // Only shipper or admin can update load
    if (load.shipperId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own loads');
    }

    const updateData: any = { ...updateLoadDto };
    if (updateLoadDto.loadingDate) {
      updateData.loadingDate = new Date(updateLoadDto.loadingDate);
    }

    return this.prisma.load.update({
      where: { id },
      data: updateData,
      include: {
        shipper: {
          select: {
            id: true,
            name: true,
            rating: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const load = await this.prisma.load.findUnique({
      where: { id },
    });

    if (!load) {
      throw new NotFoundException('Load not found');
    }

    // Only shipper or admin can delete load
    if (load.shipperId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own loads');
    }

    // Soft delete by setting status to cancelled
    return this.prisma.load.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async getLoadApplications(loadId: string, userId: string, userRole: Role) {
    const load = await this.prisma.load.findUnique({
      where: { id: loadId },
    });

    if (!load) {
      throw new NotFoundException('Load not found');
    }

    // Only shipper or admin can view applications
    if (load.shipperId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only view applications for your own loads');
    }

    return this.prisma.application.findMany({
      where: { loadId },
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            rating: true,
          },
        },
      },
    });
  }

  async getUserLoads(userId: string, userRole: Role) {
    const where = userRole === Role.SHIPPER
      ? { shipperId: userId }
      : {}; // For other roles, return all loads (they can apply)

    return this.prisma.load.findMany({
      where,
      include: {
        shipper: {
          select: {
            id: true,
            name: true,
            rating: true,
          },
        },
        applications: userRole === Role.SHIPPER ? {
          include: {
            applicant: {
              select: {
                id: true,
                name: true,
                role: true,
                rating: true,
              },
            },
          },
        } : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
