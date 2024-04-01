import { Module } from '@nestjs/common';
import { RevenueStatsService } from './revenue-stats.service';
// import { S3Service } from './s3Service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadDataServiceProvider } from 'services/fileUploadService';
import { RevenueStatsHelpers } from 'src/helpers/revenuStatsHelper';
import { LisService } from 'src/lis/lis.service';
import { CaseSchema } from 'src/schemas/caseSchema';
import { UserSchema } from 'src/schemas/userSchema';
import { FilterHelper } from 'src/helpers/filterHelper';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { SortHelper } from 'src/helpers/sortHelper';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';
import { testPanelsDataSchema } from 'src/schemas/testPanelSchema';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { RevenueStatsController } from './revenue-stats.controller';

@Module({
  controllers: [RevenueStatsController],
  providers: [RevenueStatsService, FileUploadDataServiceProvider, RevenueStatsHelpers, LisService, FilterHelper, PaginationHelper, SortHelper],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'Insurance_Payors', schema: insurancePayorsSchema },
      { name: 'Test_Panels', schema: testPanelsDataSchema },
      { name: 'Hospital', schema: HospitalSchema }
    ]),
  ]
})
export class RevenueStatsModule { }
