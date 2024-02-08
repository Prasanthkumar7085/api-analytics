import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RevenueStatsService {
  constructor(private prisma: PrismaService) { }

  // Revenue Raw Status
  async saveDataInDb(revenueData) {
    return this.prisma.revenue_marketers_schema.createMany({ data: revenueData });
  }

  async getRevenueRawData(query) {
    return this.prisma.revenue_marketers_schema.findMany({
      where: query
    });
  }

  async updateRevenueRawProcessStatus(ids, updateData) {
    return this.prisma.revenue_marketers_schema.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: updateData
    })
  }

  async deleteRevenueRawData(id) {
    return this.prisma.revenue_marketers_schema.delete({
      where: {
        id: id
      }
    })
  }



  // Revenue Stats
  async insertStats(insertData) {
    return this.prisma.revenue_stats.createMany({ data: insertData });
  }


  async deleteRevenueStats(id) {
    return this.prisma.revenue_stats.delete({
      where: {
        id: id
      }
    })
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
