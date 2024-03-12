import { Module } from '@nestjs/common';
import { CaseTypesV3Service } from './case-types-v3.service';
import { CaseTypesV3Controller } from './case-types-v3.controller';
import { FilterHelper } from 'src/helpers/filterHelper';

@Module({
  controllers: [CaseTypesV3Controller],
  providers: [CaseTypesV3Service, FilterHelper],
})
export class CaseTypesV3Module { }


