import { Module } from '@nestjs/common';
import { LisService } from './lis.service';
import { LisController } from './lis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { JwtService } from '@nestjs/jwt';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { labDataSchema } from 'src/schemas/lab';
import { MghDbConnections } from 'src/helpers/mghDbconnection';
import { MghSyncService } from 'src/mgh-sync/mgh-sync.service';
import { Configuration } from 'src/config/config.service';
import { ConfigService } from '@nestjs/config';
import { CsvHelper } from 'src/helpers/csvHelper';

@Module({
  controllers: [LisController],
  providers: [LisService, JwtService, MghDbConnections, MghSyncService, Configuration, ConfigService, CsvHelper],
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
  ],
})
export class LisModule { }
