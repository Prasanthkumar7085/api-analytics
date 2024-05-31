import { Module } from '@nestjs/common';
import { LabsService } from 'src/labs/labs.service';
import { MghSyncController } from './mgh-sync.controller';
import { MghSyncService } from './mgh-sync.service';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { LisService } from 'src/lis/lis.service';
import { CaseTypesService } from 'src/case-types/case-types.service';
import { FacilitiesService } from 'src/facilities/facilities.service';
import { InsurancesService } from 'src/insurances/insurances.service';
import { SyncService } from 'src/sync/sync.service';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { labDataSchema } from 'src/schemas/lab';
import { SalesRepsTargetsAchivedService } from 'src/sales-reps-targets-achived/sales-reps-targets-achived.service';
import { Configuration } from 'src/config/config.service';
import { ConfigService } from '@nestjs/config';
import { CsvHelper } from 'src/helpers/csvHelper';

@Module({
  controllers: [MghSyncController],
  providers: [MghSyncService, LabsService, SyncHelpers, LisService, CaseTypesService, FacilitiesService, InsurancesService, SyncService, 
    SalesRepService, SalesRepsTargetsAchivedService, Configuration, ConfigService, CsvHelper],
  imports: [
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
export class MghSyncModule { }
