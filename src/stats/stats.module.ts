import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SortHelper } from 'src/helpers/sortHelper';

@Module({
  controllers: [StatsController],
  providers: [StatsService, PaginationHelper, FilterHelper, SortHelper],
  imports: [PrismaModule]
})
export class StatsModule {}
