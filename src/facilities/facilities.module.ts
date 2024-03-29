import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesHelper } from 'src/helpers/facilitiesHelper';

import { MongooseModule } from '@nestjs/mongoose';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { SalesRepServiceV3 } from 'src/sales-rep-v3/sales-rep-v3.service';


@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesHelper, JwtService, LisService, SalesRepServiceV3],
  imports: [
    MongooseModule.forFeature([
      { name: 'Hospital', schema: HospitalSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'Insurance_Payors', schema: insurancePayorsSchema },
      { name: 'Test_Panels', schema: testPanelsDataSchema }
    ]),
  ]
})
export class FacilitiesModule { }
