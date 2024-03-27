import { Module } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { SyncV3Controller } from './sync-v3.controller';
import { LisService } from 'src/lis/lis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { syncHelpers } from 'src/helpers/syncHelper';
import { CaseTypesV3Service } from 'src/case-types-v3/case-types-v3.service';
import { FacilitiesV3Service } from 'src/facilities-v3/facilities-v3.service';
import { InsurancesV3Service } from 'src/insurances-v3/insurances-v3.service';

@Module({
  controllers: [SyncV3Controller],
  providers: [SyncV3Service, LisService, syncHelpers, CaseTypesV3Service, FacilitiesV3Service, InsurancesV3Service],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'InsurancePayors', schema: insurancePayorsSchema }
    ]),
  ]
})
export class SyncV3Module { }
