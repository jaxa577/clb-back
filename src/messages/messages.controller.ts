import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get chat with specific user' })
  @ApiResponse({ status: 200, description: 'Messages retrieved' })
  getChat(@Param('userId') userId: string, @Request() req) {
    return this.messagesService.getChat(req.user.id, userId);
  }

  @Post('send')
  @ApiOperation({ summary: 'Send message to user' })
  @ApiResponse({ status: 201, description: 'Message sent' })
  sendMessage(
    @Body() body: { receiverId: string; content: string },
    @Request() req,
  ) {
    return this.messagesService.sendMessage(req.user.id, body.receiverId, body.content);
  }
}
