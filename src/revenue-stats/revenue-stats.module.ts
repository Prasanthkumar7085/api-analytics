import { Module } from '@nestjs/common';
import { RevenueStatsService } from './revenue-stats.service';
import { RevenueStatsController } from './revenue-stats.controller';
import { S3Service } from './s3Service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadDataServiceProvider } from 'services/fileUploadService';
import { MapRevenueCsvDataHelper } from 'src/helpers/mapRevenueCsvDataHelper';

@Module({
  controllers: [RevenueStatsController],
  providers: [RevenueStatsService, S3Service, PrismaService, FileUploadDataServiceProvider, MapRevenueCsvDataHelper],
})
export class RevenueStatsModule { }
