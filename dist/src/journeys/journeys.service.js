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
exports.JourneysService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const websockets_gateway_1 = require("../websockets/websockets.gateway");
let JourneysService = class JourneysService {
    prisma;
    websocketsGateway;
    constructor(prisma, websocketsGateway) {
        this.prisma = prisma;
        this.websocketsGateway = websocketsGateway;
    }
    async startJourney(dto, userId) {
        const { loadId } = dto;
        const load = await this.prisma.load.findUnique({
            where: { id: loadId },
            include: {
                applications: {
                    where: {
                        applicantId: userId,
                        status: 'ACCEPTED',
                    },
                },
            },
        });
        if (!load) {
            throw new common_1.NotFoundException('Load not found');
        }
        if (load.applications.length === 0) {
            throw new common_1.ForbiddenException('You do not have permission to start this journey');
        }
        const existingJourney = await this.prisma.journey.findFirst({
            where: {
                loadId,
                driverId: userId,
                status: { in: ['ACTIVE', 'PAUSED'] },
            },
        });
        if (existingJourney) {
            throw new common_1.BadRequestException('Journey already started for this load');
        }
        const journey = await this.prisma.journey.create({
            data: {
                loadId,
                driverId: userId,
                status: 'ACTIVE',
            },
        });
        this.websocketsGateway.broadcastJourneyStatus(journey.id, 'ACTIVE');
        return journey;
    }
    async stopJourney(journeyId, userId) {
        const journey = await this.prisma.journey.findUnique({
            where: { id: journeyId },
        });
        if (!journey) {
            throw new common_1.NotFoundException('Journey not found');
        }
        if (journey.driverId !== userId) {
            throw new common_1.ForbiddenException('You can only stop your own journeys');
        }
        if (journey.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Journey already completed');
        }
        const updatedJourney = await this.prisma.journey.update({
            where: { id: journeyId },
            data: {
                status: 'COMPLETED',
                endTime: new Date(),
            },
        });
        this.websocketsGateway.broadcastJourneyStatus(journeyId, 'COMPLETED');
        return updatedJourney;
    }
    async updateLocation(dto) {
        const { journeyId, latitude, longitude, accuracy, speed, timestamp } = dto;
        const journey = await this.prisma.journey.findUnique({
            where: { id: journeyId },
        });
        if (!journey) {
            throw new common_1.NotFoundException('Journey not found');
        }
        if (journey.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Journey is not active');
        }
        await this.prisma.driverLocation.create({
            data: {
                journeyId,
                latitude,
                longitude,
                accuracy,
                speed,
                timestamp,
            },
        });
        await this.prisma.journey.update({
            where: { id: journeyId },
            data: {
                currentLatitude: latitude,
                currentLongitude: longitude,
            },
        });
        this.websocketsGateway.broadcastLocationUpdate(journeyId, {
            journeyId,
            latitude,
            longitude,
            accuracy,
            speed,
            timestamp,
        });
        return { success: true };
    }
    async getActiveJourney(loadId) {
        const journey = await this.prisma.journey.findFirst({
            where: {
                loadId,
                status: { in: ['ACTIVE', 'PAUSED'] },
            },
            include: {
                locations: {
                    orderBy: {
                        timestamp: 'desc',
                    },
                    take: 1,
                },
            },
        });
        if (!journey) {
            throw new common_1.NotFoundException('No active journey found');
        }
        return journey;
    }
    async getJourneyLocations(journeyId) {
        const journey = await this.prisma.journey.findUnique({
            where: { id: journeyId },
        });
        if (!journey) {
            throw new common_1.NotFoundException('Journey not found');
        }
        return this.prisma.driverLocation.findMany({
            where: { journeyId },
            orderBy: {
                timestamp: 'asc',
            },
        });
    }
    async getAllActiveJourneys() {
        const journeys = await this.prisma.journey.findMany({
            where: {
                status: 'ACTIVE',
            },
            include: {
                locations: {
                    orderBy: {
                        timestamp: 'desc',
                    },
                    take: 1,
                },
            },
        });
        return journeys;
    }
    async getActiveJourneysWithLoads() {
        const journeys = await this.prisma.journey.findMany({
            where: {
                status: 'ACTIVE',
            },
            include: {
                locations: {
                    orderBy: {
                        timestamp: 'desc',
                    },
                    take: 1,
                },
            },
        });
        const journeysWithLoads = await Promise.all(journeys.map(async (journey) => {
            const load = await this.prisma.load.findUnique({
                where: { id: journey.loadId },
                include: {
                    shipper: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            rating: true,
                        },
                    },
                },
            });
            return {
                ...journey,
                load,
            };
        }));
        return journeysWithLoads;
    }
};
exports.JourneysService = JourneysService;
exports.JourneysService = JourneysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        websockets_gateway_1.WebsocketsGateway])
], JourneysService);
//# sourceMappingURL=journeys.service.js.map