import { Module } from '@nestjs/common';
import { SalesRepsTargetsController } from './sales-reps-targets.controller';
import { SalesRepsTargetsService } from './sales-reps-targets.service';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { EmailServiceProvider } from 'src/notifications/emailServiceProvider';
import { SESAPIDataServiceProvider } from 'src/notifications/sesAPIDataServiceProvider';
import { Configuration } from 'src/config/config.service';
import { ConfigService } from '@nestjs/config';
import { FilterHelper } from 'src/helpers/filterHelper';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { labDataSchema } from 'src/schemas/lab';
import { MghDbConnections } from 'src/helpers/mghDbconnection';
import { MghSyncService } from 'src/mgh-sync/mgh-sync.service';
import { SalesRepTargetsHelper } from 'src/helpers/salesRepTargetsHelper';

@Module({
  controllers: [SalesRepsTargetsController],
  providers: [SalesRepsTargetsService, SalesRepService, EmailServiceProvider, SESAPIDataServiceProvider, Configuration, ConfigService, FilterHelper, JwtService, LisService, MghDbConnections, MghSyncService, SalesRepTargetsHelper],
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
export class SalesRepsTargetsModule { }
