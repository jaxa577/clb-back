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
exports.LoadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let LoadsService = class LoadsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createLoadDto, userId) {
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
    async findAll(query = {}) {
        const { page = 1, limit = 10, ...filters } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {
            status: 'OPEN',
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Load not found');
        }
        return load;
    }
    async update(id, updateLoadDto, userId, userRole) {
        const load = await this.prisma.load.findUnique({
            where: { id },
        });
        if (!load) {
            throw new common_1.NotFoundException('Load not found');
        }
        if (load.shipperId !== userId && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You can only update your own loads');
        }
        const updateData = { ...updateLoadDto };
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
    async remove(id, userId, userRole) {
        const load = await this.prisma.load.findUnique({
            where: { id },
        });
        if (!load) {
            throw new common_1.NotFoundException('Load not found');
        }
        if (load.shipperId !== userId && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You can only delete your own loads');
        }
        return this.prisma.load.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
    async getLoadApplications(loadId, userId, userRole) {
        const load = await this.prisma.load.findUnique({
            where: { id: loadId },
        });
        if (!load) {
            throw new common_1.NotFoundException('Load not found');
        }
        if (load.shipperId !== userId && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You can only view applications for your own loads');
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
    async getUserLoads(userId, userRole) {
        const where = userRole === client_1.Role.SHIPPER
            ? { shipperId: userId }
            : {};
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
                applications: userRole === client_1.Role.SHIPPER ? {
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
};
exports.LoadsService = LoadsService;
exports.LoadsService = LoadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoadsService);
//# sourceMappingURL=loads.service.js.map