import { Module } from '@nestjs/common';
import { SalesRepsTargetsAchivedService } from './sales-reps-targets-achived.service';
import { SalesRepsTargetsAchivedController } from './sales-reps-targets-achived.controller';

@Module({
  controllers: [SalesRepsTargetsAchivedController],
  providers: [SalesRepsTargetsAchivedService],
})
export class SalesRepsTargetsAchivedModule {}
