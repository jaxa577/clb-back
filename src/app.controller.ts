import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'SNG LoadBoard Backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('health/db')
  @ApiOperation({ summary: 'Database health check' })
  @ApiResponse({ status: 200, description: 'Database is healthy' })
  async getDatabaseHealth() {
    return this.appService.checkDatabaseHealth();
  }

  @Get('health/config')
  @ApiOperation({ summary: 'Configuration check' })
  @ApiResponse({ status: 200, description: 'Configuration status' })
  getConfigHealth() {
    return {
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
      databaseConfigured: !!process.env.DATABASE_URL,
      jwtSecretConfigured: !!process.env.JWT_SECRET,
      jwtRefreshSecretConfigured: !!process.env.JWT_REFRESH_SECRET,
      corsOrigin: process.env.CORS_ORIGIN || 'not set',
      port: process.env.PORT || 'default',
      timestamp: new Date().toISOString(),
    };
  }
}
