import { Module } from '@nestjs/common';
import { CaseTypesService } from './case-types.service';
import { CaseTypesController } from './case-types.controller';
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
import { InsurancesService } from 'src/insurances/insurances.service';
import { SyncService } from 'src/sync/sync.service';
import { FacilitiesService } from 'src/facilities/facilities.service';
import { LabsService } from 'src/labs/labs.service';
import { labDataSchema } from 'src/schemas/lab';
import { MghSyncService } from 'src/mgh-sync/mgh-sync.service';
import { MghDbConnections } from 'src/helpers/mghDbconnection';
import { SalesRepsTargetsAchivedService } from 'src/sales-reps-targets-achived/sales-reps-targets-achived.service';
import { Configuration } from 'src/config/config.service';
import { ConfigService } from '@nestjs/config';
import { SalesRepTargetsHelper } from 'src/helpers/salesRepTargetsHelper';
import { SalesRepsTargetsService } from 'src/sales-reps-targets/sales-reps-targets.service';

@Module({
  controllers: [CaseTypesController],
  providers: [CaseTypesService, FilterHelper, JwtService, LisService, SalesRepService, SyncHelpers,
    InsurancesService, FacilitiesService, SyncService, LabsService, MghSyncService, MghDbConnections, SalesRepsTargetsAchivedService,
    Configuration, ConfigService, SalesRepTargetsHelper, SalesRepsTargetsService],
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
export class CaseTypesModule { }


