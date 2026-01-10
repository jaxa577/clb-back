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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ApplicationsService = class ApplicationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createApplicationDto, userId) {
        const { loadId, role } = createApplicationDto;
        const load = await this.prisma.load.findUnique({
            where: { id: loadId },
        });
        if (!load) {
            throw new common_1.NotFoundException('Load not found');
        }
        if (load.status !== 'OPEN') {
            throw new common_1.BadRequestException('Load is not available for applications');
        }
        if (load.shipperId === userId) {
            throw new common_1.ForbiddenException('You cannot apply to your own load');
        }
        const existingApplication = await this.prisma.application.findUnique({
            where: {
                loadId_applicantId: {
                    loadId,
                    applicantId: userId,
                },
            },
        });
        if (existingApplication) {
            throw new common_1.ConflictException('You have already applied to this load');
        }
        if (role !== client_1.Role.DRIVER && role !== client_1.Role.BROKER) {
            throw new common_1.BadRequestException('Only drivers and brokers can apply to loads');
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
    async accept(id, userId, userRole) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                load: true,
                applicant: true,
            },
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (application.load.shipperId !== userId && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You can only accept applications for your own loads');
        }
        if (application.status !== 'PENDING') {
            throw new common_1.BadRequestException('Application is not pending');
        }
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
        await this.createDeal(updatedApplication);
        return updatedApplication;
    }
    async reject(id, userId, userRole) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                load: true,
            },
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (application.load.shipperId !== userId && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You can only reject applications for your own loads');
        }
        if (application.status !== 'PENDING') {
            throw new common_1.BadRequestException('Application is not pending');
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
    async createDeal(application) {
        const commission = application.applicant.role === client_1.Role.BROKER ? application.load.price * 0.05 : 0;
        return this.prisma.deal.create({
            data: {
                loadId: application.loadId,
                shipperId: application.load.shipperId,
                driverId: application.applicant.role === client_1.Role.DRIVER ? application.applicantId : null,
                brokerId: application.applicant.role === client_1.Role.BROKER ? application.applicantId : null,
                agreedPrice: application.load.price,
                commission,
            },
        });
    }
    async getUserApplications(userId) {
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
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map