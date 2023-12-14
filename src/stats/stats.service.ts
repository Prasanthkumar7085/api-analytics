import { Injectable } from '@nestjs/common';
import { UpdateStatDto } from './dto/update-stat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { query } from 'express';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) { }
  create(body) {
    return this.prisma.marketer_stats.create({ data: body })
  }

  caseWiseCounts({ query, select, skip, limit, sort }) {
    return this.prisma.marketer_stats.findMany({
      select,
      skip,
      take: limit,
      orderBy: sort,
      where: query
    });
  }

  findOne(query) {
    return this.prisma.marketer_stats.findFirst({
      where: query
    });
  }

  update(id: number, data) {
    return this.prisma.marketer_stats.upsert({
      where: {
        id: id
      },
      update: data,
      create: data,
    });
  }

  remove(id: number) {
    return this.prisma.marketer_stats.delete({
      where: {
        id: id,
      },
    })
  }

  insertMany(body) {
    return this.prisma.marketer_stats.createMany(body);
  }

  async countStats(query: any = {}) {
    return await this.prisma.marketer_stats.count({ where: query });
  }

  async marketers(query, sort) {
    return this.prisma.marketer_stats.groupBy({
      by: ['marketer_id'],
      where: query,
      _sum: {
        total_cases: true,
        pending_cases: true,
        completed_cases: true,
        hospitals_count: true,
      },
      orderBy: {
        _sum: sort
      }
    });
  }

  async findAll(query) {
    return this.prisma.marketer_stats.findMany({
      where: query
    })
  }
}
