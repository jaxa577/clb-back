import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LoadsService } from './loads.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('loads')
@Controller('loads')
@UseGuards(JwtAuthGuard)
export class LoadsController {
  constructor(private readonly loadsService: LoadsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SHIPPER, Role.BROKER)
  @ApiOperation({ summary: 'Create a new load (Shipper and Broker)' })
  @ApiResponse({ status: 201, description: 'Load created successfully' })
  create(@Body() createLoadDto: CreateLoadDto, @Request() req) {
    return this.loadsService.create(createLoadDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all loads' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Loads retrieved successfully' })
  findAll(@Query() query: any) {
    return this.loadsService.findAll(query);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user loads' })
  @ApiResponse({ status: 200, description: 'User loads retrieved successfully' })
  getUserLoads(@Request() req) {
    return this.loadsService.getUserLoads(req.user.id, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get load by ID' })
  @ApiResponse({ status: 200, description: 'Load retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Load not found' })
  findOne(@Param('id') id: string) {
    return this.loadsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SHIPPER, Role.BROKER)
  @ApiOperation({ summary: 'Update load (Shipper and Broker)' })
  @ApiResponse({ status: 200, description: 'Load updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Load not found' })
  update(@Param('id') id: string, @Body() updateLoadDto: UpdateLoadDto, @Request() req) {
    return this.loadsService.update(id, updateLoadDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SHIPPER, Role.BROKER)
  @ApiOperation({ summary: 'Delete load (Shipper and Broker)' })
  @ApiResponse({ status: 200, description: 'Load deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Load not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.loadsService.remove(id, req.user.id, req.user.role);
  }

  @Get(':id/applications')
  @ApiOperation({ summary: 'Get load applications' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getApplications(@Param('id') loadId: string, @Request() req) {
    return this.loadsService.getLoadApplications(loadId, req.user.id, req.user.role);
  }
}
