import { Module } from '@nestjs/common';
import { CaseTypesService } from './case-types.service';
import { CaseTypesController } from './case-types.controller';
import { CaseTypesHelper } from 'src/helpers/caseTypesHelper';

@Module({
  controllers: [CaseTypesController],
  providers: [CaseTypesService, CaseTypesHelper],
})
export class CaseTypesModule {}
