import { Module } from '@nestjs/common';
import { SalesRepsTargetsController } from './sales-reps-targets.controller';
import { SalesRepsTargetsService } from './sales-reps-targets.service';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';

@Module({
  controllers: [SalesRepsTargetsController],
  providers: [SalesRepsTargetsService, SalesRepService],
})
export class SalesRepsTargetsModule { }
