import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class WebsocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinJourney(client: Socket, journeyId: string): {
        event: string;
        data: {
            room: string;
            journeyId: string;
        };
    };
    handleLeaveJourney(client: Socket, journeyId: string): {
        event: string;
        data: {
            room: string;
            journeyId: string;
        };
    };
    broadcastLocationUpdate(journeyId: string, locationData: any): void;
    broadcastJourneyStatus(journeyId: string, status: string): void;
}
