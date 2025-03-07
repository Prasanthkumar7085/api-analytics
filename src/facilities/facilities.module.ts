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
import { SortHelper } from 'src/helpers/sortHelper';
import { MghDbConnections } from 'src/helpers/mghDbconnection';
import { SalesRepsTargetsAchivedService } from 'src/sales-reps-targets-achived/sales-reps-targets-achived.service';
import { Configuration } from 'src/config/config.service';
import { ConfigService } from '@nestjs/config';
import { SalesRepTargetsHelper } from 'src/helpers/salesRepTargetsHelper';
import { SalesRepsTargetsService } from 'src/sales-reps-targets/sales-reps-targets.service';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FilterHelper, JwtService, LisService, SalesRepService, SyncHelpers,
    CaseTypesService, InsurancesService, SyncService, LabsService, MghSyncService, SortHelper, MghDbConnections,
    SalesRepsTargetsAchivedService, Configuration, ConfigService, SalesRepTargetsHelper, SalesRepsTargetsService],
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
