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

  createMany(body) {
    return this.prisma.marketer_stats.createMany({ data: body })
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

  findMany(query) {
    return this.prisma.marketer_stats.findMany({
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

  updateMany(queryString) {
    const rawQuery = `
    UPDATE marketer_stats AS t
  SET 
      total_cases = u.total_cases,
      pending_cases = u.pending_cases,
      completed_cases = u.completed_cases,
      hospitals_count = u.hospitals_count,
      case_type_wise_counts = u.case_type_wise_counts,
      hospital_case_type_wise_counts = u.hospital_case_type_wise_counts
  FROM (
      VALUES
      ${queryString}
      ) as u(id, marketer_id, total_cases, pending_cases, completed_cases, hospitals_count, case_type_wise_counts, hospital_case_type_wise_counts)
  WHERE t.id = u.id`;

    return this.prisma.$executeRawUnsafe(rawQuery);

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
    let data = this.prisma.marketer_stats.groupBy({
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

    return data;
  }

  async findAll(query) {
    return this.prisma.marketer_stats.findMany({
      where: query
    })
  }

  async marketersMonthWise(query) {
    const startDate = query.date.gte;
    const endDate = query.date.lte;
    const marketerIds = query.marketer_id?.in;

    let rawQueryData;
    if (marketerIds && marketerIds.length) {
      rawQueryData = this.prisma.$queryRaw`
        SELECT
          TO_CHAR(DATE_TRUNC('month', date), 'YYYY Mon') as month,
          SUM(total_cases)::text as total_cases,
          SUM(pending_cases)::text as pending_cases,
          SUM(completed_cases)::text as completed_cases,
          SUM(hospitals_count)::text as hospitals_count
        FROM
          marketer_stats
        WHERE
          date BETWEEN CAST(${startDate} AS timestamp) AND CAST(${endDate} AS timestamp)
          AND marketer_id = ANY (${marketerIds}::text[])
        GROUP BY
          month
        `;
    } else {
      rawQueryData = this.prisma.$queryRaw`
        SELECT
          TO_CHAR(DATE_TRUNC('month', date), 'YYYY Mon') as month,
          SUM(total_cases)::text as total_cases,
          SUM(pending_cases)::text as pending_cases,
          SUM(completed_cases)::text as completed_cases,
          SUM(hospitals_count)::text as hospitals_count
        FROM
          marketer_stats
        WHERE
          date BETWEEN CAST(${startDate} AS timestamp) AND CAST(${endDate} AS timestamp)
        GROUP BY
          month
        `;
    }

    const combinedData: any = await rawQueryData;

    return combinedData;
  }


  async getCaseTypeWise(query) {
    const startDate = query.date.gte;
    const endDate = query.date.lte;

    const rawQueryData = this.prisma.$queryRaw`
    SELECT
        TO_CHAR(DATE_TRUNC('month', date), 'YYYY Mon') as month,
        SUM(total_cases)::text as total_cases,
        SUM(pending_cases)::text as pending_cases,
        SUM(completed_cases)::text as completed_cases,
        SUM(hospitals_count)::text as hospitals_count,
    FROM
        marketer_stats,
        
    WHERE
        date BETWEEN CAST(${startDate} AS timestamp) AND CAST(${endDate} AS timestamp)
    GROUP BY
        month;
`;

    const combinedData: any = await rawQueryData;

    return combinedData;
  }
}
