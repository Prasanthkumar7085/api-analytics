import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { FilterHelper } from 'src/helpers/filterHelper';
import { MghDbConnections } from 'src/helpers/mghDbconnection';
import { LisService } from 'src/lis/lis.service';
import { MghSyncService } from 'src/mgh-sync/mgh-sync.service';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { SalesRepsTargetsService } from 'src/sales-reps-targets/sales-reps-targets.service';
import { CaseSchema } from 'src/schemas/caseSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { labDataSchema } from 'src/schemas/lab';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { UserSchema } from 'src/schemas/userSchema';
import { SalesRepsTargetsAchivedController } from './sales-reps-targets-achived.controller';
import { SalesRepsTargetsAchivedService } from './sales-reps-targets-achived.service';

@Module({
  controllers: [SalesRepsTargetsAchivedController],
  providers: [SalesRepsTargetsAchivedService, SalesRepsTargetsService, JwtService, LisService, SalesRepService, MghDbConnections,
    MghSyncService, FilterHelper
  ],
  imports:[
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'Insurance_Payors', schema: insurancePayorsSchema },
      { name: 'Test_Panels', schema: testPanelsDataSchema },
      { name: 'Hospital', schema: HospitalSchema },
      { name: 'Lab', schema: labDataSchema }

    ])
  ]
})
export class SalesRepsTargetsAchivedModule {}
