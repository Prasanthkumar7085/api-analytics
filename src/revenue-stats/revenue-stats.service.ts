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
    return this.prisma.revenue_marketers_schema.deleteMany({
      
    })
  }



  // Revenue Stats
  async insertStats(insertData) {
    return this.prisma.revenue_stats.createMany({ data: insertData });
  }


  async deleteRevenueStats(id) {
    return this.prisma.revenue_stats.deleteMany({
   
    })
  }

  async getRevenueStats(query) {
    return this.prisma.revenue_stats.findMany({
      where: query
    });
  }
}
