import { Injectable } from '@nestjs/common';
import { CreateRevenueStatDto } from './dto/create-revenue-stat.dto';
import { UpdateRevenueStatDto } from './dto/update-revenue-stat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RevenueStatsService {
  constructor(private prisma: PrismaService) { }

  async saveDataInDb(revenueData) {
    // return this.prisma.revenue_marketers_schema.createMany({ data: revenueData })
  }
}
