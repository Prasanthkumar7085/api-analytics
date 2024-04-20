import { Module } from '@nestjs/common';
import { SalesRepsTargetsAchivedService } from './sales-reps-targets-achived.service';
import { SalesRepsTargetsAchivedController } from './sales-reps-targets-achived.controller';
import { TargetsAchivedHelper } from 'src/helpers/targetsAchivedHelper';
import { SalesRepsTargetsService } from 'src/sales-reps-targets/sales-reps-targets.service';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { labDataSchema } from 'src/schemas/lab';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { MghDbConnections } from 'src/helpers/mghDbconnection';
import { MghSyncService } from 'src/mgh-sync/mgh-sync.service';
import { FilterHelper } from 'src/helpers/filterHelper';

@Module({
  controllers: [SalesRepsTargetsAchivedController],
  providers: [SalesRepsTargetsAchivedService, TargetsAchivedHelper, SalesRepsTargetsService, JwtService, LisService, SalesRepService, MghDbConnections,
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
