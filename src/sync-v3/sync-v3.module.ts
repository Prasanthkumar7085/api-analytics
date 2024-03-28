import { LisService } from 'src/lis/lis.service';
import { Module } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { SyncV3Controller } from './sync-v3.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { syncHelpers } from 'src/helpers/syncHelper';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { Configuration } from 'src/config/config.service';
import { ConfigService } from '@nestjs/config';
import { InsurancesV3Service } from 'src/insurances-v3/insurances-v3.service';

@Module({
  controllers: [SyncV3Controller],
  providers: [SyncV3Service, LisService, syncHelpers, Configuration, ConfigService, InsurancesV3Service],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'Insurance_Payors', schema: insurancePayorsSchema },
      { name: 'Test_Panels', schema: testPanelsDataSchema },
      { name: 'Hospital', schema: HospitalSchema }
    ]),
  ]
})
export class SyncV3Module { }
