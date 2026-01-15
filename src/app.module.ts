import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { LoadsModule } from './loads/loads.module';
import { ApplicationsModule } from './applications/applications.module';
import { DealsModule } from './deals/deals.module';
import { MessagesModule } from './messages/messages.module';
import { ReviewsModule } from './reviews/reviews.module';
import { JourneysModule } from './journeys/journeys.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),
    AuthModule,
    PrismaModule,
    UsersModule,
    LoadsModule,
    ApplicationsModule,
    DealsModule,
    MessagesModule,
    ReviewsModule,
    JourneysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
