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

@Module({
  controllers: [RevenueStatsController],
  providers: [RevenueStatsService, PrismaService, FileUploadDataServiceProvider, RevenueStatsHelpers, LisService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema }
    ]),
  ]
})
export class RevenueStatsModule { }
