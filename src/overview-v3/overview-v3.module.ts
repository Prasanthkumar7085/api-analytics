import { Module } from '@nestjs/common';
import { OverviewV3Service } from './overview-v3.service';
import { OverviewV3Controller } from './overview-v3.controller';
import { FilterHelper } from 'src/helpers/filterHelper';

@Module({
  controllers: [OverviewV3Controller],
  providers: [OverviewV3Service,FilterHelper],
})
export class OverviewV3Module {}
