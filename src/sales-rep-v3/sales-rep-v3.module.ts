import { Module } from '@nestjs/common';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SalesRepControllerV3 } from './sales-rep-v3.controller';
import { SalesRepServiceV3 } from './sales-rep-v3.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';

@Module({
  controllers: [SalesRepControllerV3],
  providers: [SalesRepServiceV3, FilterHelper, JwtService, LisService],
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
export class SalesRepModuleV3 { }
