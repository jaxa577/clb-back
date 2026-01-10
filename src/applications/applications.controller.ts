import { Controller, Post, Body, Patch, Param, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';

@ApiTags('applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Apply to a load' })
  @ApiResponse({ status: 201, description: 'Application created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Already applied' })
  create(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    return this.applicationsService.create(createApplicationDto, req.user.id);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Accept application (Shipper only)' })
  @ApiResponse({ status: 200, description: 'Application accepted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  accept(@Param('id') id: string, @Request() req) {
    return this.applicationsService.accept(id, req.user.id, req.user.role);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject application (Shipper only)' })
  @ApiResponse({ status: 200, description: 'Application rejected' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  reject(@Param('id') id: string, @Request() req) {
    return this.applicationsService.reject(id, req.user.id, req.user.role);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user applications' })
  @ApiResponse({ status: 200, description: 'Applications retrieved' })
  getUserApplications(@Request() req) {
    return this.applicationsService.getUserApplications(req.user.id);
  }
}
