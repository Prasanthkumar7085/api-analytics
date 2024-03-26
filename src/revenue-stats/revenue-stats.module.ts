import { Module } from '@nestjs/common';
import { RevenueStatsController } from './revenue-stats.controller';
import { RevenueStatsService } from './revenue-stats.service';
// import { S3Service } from './s3Service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadDataServiceProvider } from 'services/fileUploadService';
import { RevenueStatsHelpers } from 'src/helpers/revenuStatsHelper';
import { LisService } from 'src/lis/lis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaseSchema } from 'src/schemas/caseSchema';
import { UserSchema } from 'src/schemas/userSchema';
import { FilterHelper } from 'src/helpers/filterHelper';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { StatsHelper } from 'src/helpers/statsHelper';
import { StatsService } from 'src/stats/stats.service';
import { SortHelper } from 'src/helpers/sortHelper';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';

@Module({
  controllers: [RevenueStatsController],
  providers: [RevenueStatsService, PrismaService, FileUploadDataServiceProvider, RevenueStatsHelpers, LisService, FilterHelper, PaginationHelper, StatsHelper, StatsService, SortHelper],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'Insurance_Payors', schema: insurancePayorsSchema }
    ]),
  ]
})
export class RevenueStatsModule { }
