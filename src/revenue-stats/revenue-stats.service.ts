import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RevenueStatsService {
  constructor(private prisma: PrismaService) { }

  async saveDataInDb(revenueData) {
    return this.prisma.revenue_marketers_schema.createMany({ data: revenueData })
  }

  async getRawRevenueRawData() {
    return this.prisma.revenue_marketers_schema.findMany({})
  }

  async getRevenueStats({ query, select, skip, limit, sort }) {
    return this.prisma.revenue_stats.findMany({
      select,
      skip,
      take: limit,
      orderBy: sort,
      where: query
    });
  }

  async countStats(query) {
    return this.prisma.revenue_stats.count({ where: query })
  }

  async fetchRecord(id: number) {
    return this.prisma.revenue_stats.findFirst({ where: { id } });
  }
}
