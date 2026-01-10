import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  @ApiResponse({ status: 201, description: 'Review created' })
  create(
    @Body() body: { toUserId: string; rating: number; comment?: string },
    @Request() req,
  ) {
    return this.reviewsService.create(req.user.id, body.toUserId, body.rating, body.comment);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get reviews for user' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved' })
  getUserReviews(@Param('userId') userId: string) {
    return this.reviewsService.getUserReviews(userId);
  }
}
