import { Module } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';
import { FilterHelper } from 'src/helpers/filterHelper';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { labDataSchema } from 'src/schemas/lab';
import { MghDbConnections } from 'src/helpers/mghDbconnection';
import { MghSyncService } from 'src/mgh-sync/mgh-sync.service';
import { SalesRepsTargetsService } from 'src/sales-reps-targets/sales-reps-targets.service';
import { SalesRepHelper } from 'src/helpers/salesRepHelper';
import { SortHelper } from 'src/helpers/sortHelper';
@Module({
  controllers: [OverviewController],
  providers: [OverviewService, FilterHelper, JwtService, LisService, SalesRepService, MghDbConnections, MghSyncService, SalesRepsTargetsService, SalesRepHelper, SortHelper],
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
export class OverviewModule { }
