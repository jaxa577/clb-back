import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketsGateway } from '../websockets/websockets.gateway';
import { StartJourneyDto } from './dto/start-journey.dto';
import { LocationUpdateDto } from './dto/location-update.dto';

@Injectable()
export class JourneysService {
  constructor(
    private prisma: PrismaService,
    private websocketsGateway: WebsocketsGateway,
  ) {}

  async startJourney(dto: StartJourneyDto, userId: string) {
    const { loadId } = dto;

    // Verify load exists and user has access
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
      throw new NotFoundException('Load not found');
    }

    // Check if user has an accepted application for this load
    if (load.applications.length === 0) {
      throw new ForbiddenException('You do not have permission to start this journey');
    }

    // Check if there's already an active journey
    const existingJourney = await this.prisma.journey.findFirst({
      where: {
        loadId,
        driverId: userId,
        status: { in: ['ACTIVE', 'PAUSED'] },
      },
    });

    if (existingJourney) {
      throw new BadRequestException('Journey already started for this load');
    }

    // Create journey
    const journey = await this.prisma.journey.create({
      data: {
        loadId,
        driverId: userId,
        status: 'ACTIVE',
      },
    });

    // Broadcast journey started event
    this.websocketsGateway.broadcastJourneyStatus(journey.id, 'ACTIVE');

    return journey;
  }

  async stopJourney(journeyId: string, userId: string) {
    const journey = await this.prisma.journey.findUnique({
      where: { id: journeyId },
    });

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    if (journey.driverId !== userId) {
      throw new ForbiddenException('You can only stop your own journeys');
    }

    if (journey.status === 'COMPLETED') {
      throw new BadRequestException('Journey already completed');
    }

    const updatedJourney = await this.prisma.journey.update({
      where: { id: journeyId },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
      },
    });

    // Broadcast journey completed event
    this.websocketsGateway.broadcastJourneyStatus(journeyId, 'COMPLETED');

    return updatedJourney;
  }

  async updateLocation(dto: LocationUpdateDto) {
    const { journeyId, latitude, longitude, accuracy, speed, timestamp } = dto;

    // Verify journey exists and is active
    const journey = await this.prisma.journey.findUnique({
      where: { id: journeyId },
    });

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    if (journey.status !== 'ACTIVE') {
      throw new BadRequestException('Journey is not active');
    }

    // Save location to database
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

    // Update journey's current location
    await this.prisma.journey.update({
      where: { id: journeyId },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
      },
    });

    // Broadcast location update to WebSocket clients
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

  async getActiveJourney(loadId: string) {
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
      throw new NotFoundException('No active journey found');
    }

    return journey;
  }

  async getJourneyLocations(journeyId: string) {
    const journey = await this.prisma.journey.findUnique({
      where: { id: journeyId },
    });

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    return this.prisma.driverLocation.findMany({
      where: { journeyId },
      orderBy: {
        timestamp: 'asc',
      },
    });
  }
}
