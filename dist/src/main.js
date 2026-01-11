"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [`'self'`],
                styleSrc: [`'self'`, `'unsafe-inline'`],
                imgSrc: [`'self'`, 'data:', 'https:'],
                scriptSrc: [`'self'`],
            },
        },
    }));
    const corsOrigin = configService.get('CORS_ORIGIN') || 'http://localhost:3000';
    const allowedOrigins = corsOrigin.split(',').map((origin) => origin.trim());
    app.enableCors({
        origin: allowedOrigins.length > 1 ? allowedOrigins : corsOrigin,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SNG LoadBoard API')
        .setDescription('B2B logistics marketplace API for SNG countries')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('loads', 'Load management')
        .addTag('applications', 'Load applications')
        .addTag('deals', 'Deal management')
        .addTag('chat', 'Real-time messaging')
        .addTag('reviews', 'User reviews and ratings')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    await app.listen(configService.get('PORT') ?? 3000);
    console.log(`Application is running on: http://localhost:${configService.get('PORT') ?? 3000}`);
    console.log(`Swagger documentation available at: http://localhost:${configService.get('PORT') ?? 3000}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map