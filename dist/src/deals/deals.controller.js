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
exports.DealsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const deals_service_1 = require("./deals.service");
const confirm_deal_dto_1 = require("./dto/confirm-deal.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DealsController = class DealsController {
    dealsService;
    constructor(dealsService) {
        this.dealsService = dealsService;
    }
    confirm(confirmDealDto, req) {
        return this.dealsService.confirmDeal(confirmDealDto.loadId, req.user.id);
    }
    getUserDeals(req) {
        return this.dealsService.getUserDeals(req.user.id);
    }
};
exports.DealsController = DealsController;
__decorate([
    (0, common_1.Post)('confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm deal completion' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deal confirmed' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_deal_dto_1.ConfirmDealDto, Object]),
    __metadata("design:returntype", void 0)
], DealsController.prototype, "confirm", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user deals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deals retrieved' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DealsController.prototype, "getUserDeals", null);
exports.DealsController = DealsController = __decorate([
    (0, swagger_1.ApiTags)('deals'),
    (0, common_1.Controller)('deals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [deals_service_1.DealsService])
], DealsController);
//# sourceMappingURL=deals.controller.js.map