import { Module } from '@nestjs/common';
import { LoadsService } from './loads.service';
import { LoadsController } from './loads.controller';

@Module({
  providers: [LoadsService],
  controllers: [LoadsController]
})
export class LoadsModule {}
