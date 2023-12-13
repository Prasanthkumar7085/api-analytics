import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { FilterHelper } from 'src/helpers/filterHelper';

@Module({
  controllers: [StatsController],
  providers: [StatsService, PaginationHelper, FilterHelper],
  imports: [PrismaModule]
})
export class StatsModule {}
