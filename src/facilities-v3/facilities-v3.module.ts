import { Module } from '@nestjs/common';
import { FacilitiesV3Service } from './facilities-v3.service';
import { FacilitiesV3Controller } from './facilities-v3.controller';
import { FilterHelper } from 'src/helpers/filterHelper';

@Module({
  controllers: [FacilitiesV3Controller],
  providers: [FacilitiesV3Service, FilterHelper],
})
export class FacilitiesV3Module { }
