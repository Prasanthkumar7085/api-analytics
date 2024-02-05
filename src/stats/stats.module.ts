import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SortHelper } from 'src/helpers/sortHelper';
import { UserSchema } from 'src/schemas/userSchema';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsHelper } from 'src/helpers/statsHelper';
import { LisService } from 'src/lis/lis.service';


@Module({
  controllers: [StatsController],
  providers: [StatsService, PaginationHelper, FilterHelper, SortHelper, LisService, StatsHelper],
  imports: [
    PrismaModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ]),
  ]
})
export class StatsModule {}
