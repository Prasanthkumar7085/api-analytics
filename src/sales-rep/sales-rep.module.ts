import { Module } from '@nestjs/common';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SalesRepController } from './sales-rep.controller';
import { SalesRepService } from './sales-rep.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { CaseTypesService } from 'src/case-types/case-types.service';
import { FacilitiesService } from 'src/facilities/facilities.service';
import { InsurancesService } from 'src/insurances/insurances.service';
import { SyncService } from 'src/sync/sync.service';

@Module({
  controllers: [SalesRepController],
  providers: [SalesRepService, FilterHelper, JwtService, LisService, SyncHelpers, CaseTypesService, FacilitiesService, InsurancesService,
    SyncService],
  imports: [
    MongooseModule.forRoot(process.env.LIS_DLW_DB_URL + '&authSource=admin'),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'Insurance_Payors', schema: insurancePayorsSchema },
      { name: 'Test_Panels', schema: testPanelsDataSchema },
      { name: 'Hospital', schema: HospitalSchema }
    ]),
  ]
})
export class SalesRepModule { }
