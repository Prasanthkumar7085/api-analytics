import { Module } from '@nestjs/common';
import { InsurancesV3Service } from './insurances-v3.service';
import { InsurancesV3Controller } from './insurances-v3.controller';
import { FilterHelper } from 'src/helpers/filterHelper';

@Module({
  controllers: [InsurancesV3Controller],
  providers: [InsurancesV3Service,FilterHelper],
})
export class InsurancesV3Module {}
