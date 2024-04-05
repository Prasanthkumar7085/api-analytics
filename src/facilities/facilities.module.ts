import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FilterHelper } from 'src/helpers/filterHelper';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { CaseTypesService } from 'src/case-types/case-types.service';
import { InsurancesService } from 'src/insurances/insurances.service';
import { SyncService } from 'src/sync/sync.service';
import { LabsService } from 'src/labs/labs.service';
import { labDataSchema } from 'src/schemas/lab';
import { MghSyncService } from 'src/mgh-sync/mgh-sync.service';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FilterHelper, JwtService, LisService, SalesRepService, SyncHelpers,
    CaseTypesService, InsurancesService, SyncService, LabsService, MghSyncService],
  imports: [
    MongooseModule.forRoot(process.env.LIS_DLW_DB_URL + '&authSource=admin'),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'Insurance_Payors', schema: insurancePayorsSchema },
      { name: 'Test_Panels', schema: testPanelsDataSchema },
      { name: 'Hospital', schema: HospitalSchema },
      { name: 'Lab', schema: labDataSchema }

    ]),
  ]

})
export class FacilitiesModule { }
