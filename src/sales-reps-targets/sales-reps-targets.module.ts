import { Module } from '@nestjs/common';
import { SalesRepsTargetsService } from './sales-reps-targets.service';
import { SalesRepsTargetsController } from './sales-reps-targets.controller';

@Module({
  controllers: [SalesRepsTargetsController],
  providers: [SalesRepsTargetsService],
})
export class SalesRepsTargetsModule {}
