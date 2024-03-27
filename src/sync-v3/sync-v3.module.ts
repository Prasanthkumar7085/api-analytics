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

@Module({
  controllers: [SyncV3Controller],
  providers: [SyncV3Service, LisService, syncHelpers],
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
