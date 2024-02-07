import { Module } from '@nestjs/common';
import { RevenueStatsService } from './revenue-stats.service';
import { RevenueStatsController } from './revenue-stats.controller';
// import { S3Service } from './s3Service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadDataServiceProvider } from 'services/fileUploadService';
import { RevenueStatsHelpers } from 'src/helpers/revenuStatsHelper';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { LisService } from 'src/lis/lis.service';

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
