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
exports.LoadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const loads_service_1 = require("./loads.service");
const create_load_dto_1 = require("./dto/create-load.dto");
const update_load_dto_1 = require("./dto/update-load.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let LoadsController = class LoadsController {
    loadsService;
    constructor(loadsService) {
        this.loadsService = loadsService;
    }
    create(createLoadDto, req) {
        return this.loadsService.create(createLoadDto, req.user.id);
    }
    findAll(query) {
        return this.loadsService.findAll(query);
    }
    getUserLoads(req) {
        return this.loadsService.getUserLoads(req.user.id, req.user.role);
    }
    findOne(id) {
        return this.loadsService.findOne(id);
    }
    update(id, updateLoadDto, req) {
        return this.loadsService.update(id, updateLoadDto, req.user.id, req.user.role);
    }
    remove(id, req) {
        return this.loadsService.remove(id, req.user.id, req.user.role);
    }
    getApplications(loadId, req) {
        return this.loadsService.getLoadApplications(loadId, req.user.id, req.user.role);
    }
};
exports.LoadsController = LoadsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SHIPPER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new load (Shipper only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Load created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_load_dto_1.CreateLoadDto, Object]),
    __metadata("design:returntype", void 0)
], LoadsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all loads' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Loads retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoadsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user loads' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User loads retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoadsController.prototype, "getUserLoads", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get load by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Load retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Load not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SHIPPER),
    (0, swagger_1.ApiOperation)({ summary: 'Update load (Shipper only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Load updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Load not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_load_dto_1.UpdateLoadDto, Object]),
    __metadata("design:returntype", void 0)
], LoadsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SHIPPER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete load (Shipper only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Load deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Load not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LoadsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get load applications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Applications retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LoadsController.prototype, "getApplications", null);
exports.LoadsController = LoadsController = __decorate([
    (0, swagger_1.ApiTags)('loads'),
    (0, common_1.Controller)('loads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [loads_service_1.LoadsService])
], LoadsController);
//# sourceMappingURL=loads.controller.js.map