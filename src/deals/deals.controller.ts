import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { ConfirmDealDto } from './dto/confirm-deal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('deals')
@Controller('deals')
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm deal completion' })
  @ApiResponse({ status: 200, description: 'Deal confirmed' })
  confirm(@Body() confirmDealDto: ConfirmDealDto, @Request() req) {
    return this.dealsService.confirmDeal(confirmDealDto.loadId, req.user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user deals' })
  @ApiResponse({ status: 200, description: 'Deals retrieved' })
  getUserDeals(@Request() req) {
    return this.dealsService.getUserDeals(req.user.id);
  }
}
