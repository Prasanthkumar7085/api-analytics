import { LisService } from 'src/lis/lis.service';
import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { Configuration } from 'src/config/config.service';
import { ConfigService } from '@nestjs/config';
import { InsurancesService } from 'src/insurances/insurances.service';
import { CaseTypesService } from 'src/case-types/case-types.service';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';

import { FacilitiesService } from 'src/facilities/facilities.service';
import { LabsService } from 'src/labs/labs.service';
import { labDataSchema } from 'src/schemas/lab';
import { MghSyncService } from 'src/mgh-sync/mgh-sync.service';

@Module({
  controllers: [SyncController],
  providers: [SyncService, LisService, SyncHelpers, Configuration, ConfigService,
    InsurancesService, FacilitiesService, CaseTypesService, SalesRepService, LabsService, MghSyncService],
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
export class SyncModule { }
