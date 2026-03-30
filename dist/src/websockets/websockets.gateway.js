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
exports.WebsocketsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let WebsocketsGateway = class WebsocketsGateway {
    server;
    logger = new common_1.Logger('WebsocketsGateway');
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleJoinJourney(client, journeyId) {
        const room = `journey:${journeyId}`;
        client.join(room);
        this.logger.log(`Client ${client.id} joined room: ${room}`);
        return { event: 'joined', data: { room, journeyId } };
    }
    handleLeaveJourney(client, journeyId) {
        const room = `journey:${journeyId}`;
        client.leave(room);
        this.logger.log(`Client ${client.id} left room: ${room}`);
        return { event: 'left', data: { room, journeyId } };
    }
    broadcastLocationUpdate(journeyId, locationData) {
        const room = `journey:${journeyId}`;
        this.server.to(room).emit('location-update', locationData);
        this.logger.debug(`Broadcasting location to room: ${room}`);
    }
    broadcastJourneyStatus(journeyId, status) {
        const room = `journey:${journeyId}`;
        this.server.to(room).emit('journey-status', { journeyId, status });
        this.logger.debug(`Broadcasting status change to room: ${room}`);
    }
};
exports.WebsocketsGateway = WebsocketsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-journey'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebsocketsGateway.prototype, "handleJoinJourney", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-journey'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebsocketsGateway.prototype, "handleLeaveJourney", null);
exports.WebsocketsGateway = WebsocketsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
    })
], WebsocketsGateway);
//# sourceMappingURL=websockets.gateway.js.map