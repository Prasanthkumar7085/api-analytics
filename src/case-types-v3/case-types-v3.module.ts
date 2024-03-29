import { Module } from '@nestjs/common';
import { CaseTypesV3Service } from './case-types-v3.service';
import { CaseTypesV3Controller } from './case-types-v3.controller';
import { FilterHelper } from 'src/helpers/filterHelper';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { SalesRepServiceV3 } from 'src/sales-rep-v3/sales-rep-v3.service';

@Module({
  controllers: [CaseTypesV3Controller],
  providers: [CaseTypesV3Service, FilterHelper, JwtService, LisService, SalesRepServiceV3],
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
export class CaseTypesV3Module { }


