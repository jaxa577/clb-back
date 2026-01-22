import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JourneysService } from './journeys.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StartJourneyDto } from './dto/start-journey.dto';
import { LocationUpdateDto } from './dto/location-update.dto';

@ApiTags('journeys')
@Controller('journeys')
@UseGuards(JwtAuthGuard)
export class JourneysController {
  constructor(private readonly journeysService: JourneysService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a journey' })
  @ApiResponse({ status: 201, description: 'Journey started' })
  startJourney(@Body() dto: StartJourneyDto, @Request() req) {
    return this.journeysService.startJourney(dto, req.user.id);
  }

  @Post('stop/:journeyId')
  @ApiOperation({ summary: 'Stop a journey' })
  @ApiResponse({ status: 200, description: 'Journey stopped' })
  stopJourney(@Param('journeyId') journeyId: string, @Request() req) {
    return this.journeysService.stopJourney(journeyId, req.user.id);
  }

  @Post('locations')
  @ApiOperation({ summary: 'Update driver location' })
  @ApiResponse({ status: 201, description: 'Location updated' })
  updateLocation(@Body() dto: LocationUpdateDto) {
    return this.journeysService.updateLocation(dto);
  }

  @Get('tracking/active')
  @ApiOperation({ summary: 'Get all active journeys with load details for tracking' })
  @ApiResponse({ status: 200, description: 'Active journeys retrieved' })
  getActiveJourneysWithLoads() {
    return this.journeysService.getActiveJourneysWithLoads();
  }

  @Get('active/:loadId')
  @ApiOperation({ summary: 'Get active journey for a load' })
  @ApiResponse({ status: 200, description: 'Active journey found' })
  getActiveJourney(@Param('loadId') loadId: string) {
    return this.journeysService.getActiveJourney(loadId);
  }

  @Get(':journeyId/locations')
  @ApiOperation({ summary: 'Get all locations for a journey' })
  @ApiResponse({ status: 200, description: 'Journey locations retrieved' })
  getJourneyLocations(@Param('journeyId') journeyId: string) {
    return this.journeysService.getJourneyLocations(journeyId);
  }
}
