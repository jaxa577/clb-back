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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneysController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const journeys_service_1 = require("./journeys.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const start_journey_dto_1 = require("./dto/start-journey.dto");
const location_update_dto_1 = require("./dto/location-update.dto");
let JourneysController = class JourneysController {
    journeysService;
    constructor(journeysService) {
        this.journeysService = journeysService;
    }
    startJourney(dto, req) {
        return this.journeysService.startJourney(dto, req.user.id);
    }
    stopJourney(journeyId, req) {
        return this.journeysService.stopJourney(journeyId, req.user.id);
    }
    updateLocation(dto) {
        return this.journeysService.updateLocation(dto);
    }
    getActiveJourneysWithLoads() {
        return this.journeysService.getActiveJourneysWithLoads();
    }
    getActiveJourney(loadId) {
        return this.journeysService.getActiveJourney(loadId);
    }
    getJourneyLocations(journeyId) {
        return this.journeysService.getJourneyLocations(journeyId);
    }
};
exports.JourneysController = JourneysController;
__decorate([
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a journey' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Journey started' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_journey_dto_1.StartJourneyDto, Object]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "startJourney", null);
__decorate([
    (0, common_1.Post)('stop/:journeyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Stop a journey' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Journey stopped' }),
    __param(0, (0, common_1.Param)('journeyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "stopJourney", null);
__decorate([
    (0, common_1.Post)('locations'),
    (0, swagger_1.ApiOperation)({ summary: 'Update driver location' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Location updated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [location_update_dto_1.LocationUpdateDto]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Get)('tracking/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active journeys with load details for tracking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active journeys retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "getActiveJourneysWithLoads", null);
__decorate([
    (0, common_1.Get)('active/:loadId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active journey for a load' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active journey found' }),
    __param(0, (0, common_1.Param)('loadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "getActiveJourney", null);
__decorate([
    (0, common_1.Get)(':journeyId/locations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all locations for a journey' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Journey locations retrieved' }),
    __param(0, (0, common_1.Param)('journeyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "getJourneyLocations", null);
exports.JourneysController = JourneysController = __decorate([
    (0, swagger_1.ApiTags)('journeys'),
    (0, common_1.Controller)('journeys'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [journeys_service_1.JourneysService])
], JourneysController);
//# sourceMappingURL=journeys.controller.js.map