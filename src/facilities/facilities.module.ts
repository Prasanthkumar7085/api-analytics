import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesHelper } from 'src/helpers/facilitiesHelper';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesHelper],
})
export class FacilitiesModule {}
