import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, specify your frontend URL
    credentials: true,
  },
})
export class WebsocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('WebsocketsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-journey')
  handleJoinJourney(client: Socket, journeyId: string) {
    const room = `journey:${journeyId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    return { event: 'joined', data: { room, journeyId } };
  }

  @SubscribeMessage('leave-journey')
  handleLeaveJourney(client: Socket, journeyId: string) {
    const room = `journey:${journeyId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    return { event: 'left', data: { room, journeyId } };
  }

  // Broadcast location update to all clients in a journey room
  broadcastLocationUpdate(journeyId: string, locationData: any) {
    const room = `journey:${journeyId}`;
    this.server.to(room).emit('location-update', locationData);
    this.logger.debug(`Broadcasting location to room: ${room}`);
  }

  // Broadcast journey status change (started, paused, completed)
  broadcastJourneyStatus(journeyId: string, status: string) {
    const room = `journey:${journeyId}`;
    this.server.to(room).emit('journey-status', { journeyId, status });
    this.logger.debug(`Broadcasting status change to room: ${room}`);
  }
}
