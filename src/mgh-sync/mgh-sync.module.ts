import { Module } from '@nestjs/common';
import { MghSyncService } from './mgh-sync.service';
import { MghSyncController } from './mgh-sync.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';

@Module({
  controllers: [MghSyncController],
  providers: [MghSyncService],
  imports: [
    MongooseModule.forRoot(process.env.LIS_MGH_DB_URL + '&authSource=admin'),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'Insurance_Payors', schema: insurancePayorsSchema },
      { name: 'Test_Panels', schema: testPanelsDataSchema },
      { name: 'Hospital', schema: HospitalSchema }
    ]),
  ]
})
export class MghSyncModule { }
