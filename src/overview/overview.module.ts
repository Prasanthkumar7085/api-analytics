import { Module } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';
import { SalesRepHelper } from 'src/helpers/salesRepHelper';

@Module({
  controllers: [OverviewController],
  providers: [OverviewService, SalesRepHelper],
})
export class OverviewModule { }
