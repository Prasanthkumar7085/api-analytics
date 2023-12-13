import { Injectable } from '@nestjs/common';
import { UpdateStatDto } from './dto/update-stat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) { }
  create(body) {
    return this.prisma.marketer_stats.create({ data: body })
  }

  findAll({ query, select, skip, limit, sort }) {
    return this.prisma.marketer_stats.findMany({
      select,
      skip,
      take: limit,
      orderBy: sort,
      where: query
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} stat`;
  }

  update(id: number, updateStatDto: UpdateStatDto) {
    return `This action updates a #${id} stat`;
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
}
