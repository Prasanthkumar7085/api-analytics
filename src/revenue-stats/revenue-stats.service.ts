import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RevenueStatsService {
  constructor(private prisma: PrismaService) { }

  // Revenue Raw Status
  async saveDataInDb(revenueData) {
    return this.prisma.patient_payments.createMany({ data: revenueData });
  }

  async getRevenueRawData(query) {
    return this.prisma.patient_payments.findMany({
      where: query
    });
  }

  async updateRevenueRawProcessStatus(ids, updateData) {
    return this.prisma.patient_payments.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: updateData
    })
  }

  async deleteRevenueRawData(id) {
    return this.prisma.patient_payments.deleteMany({
      where: {
        id: id
      }
    })
  }


  async updateManyRaw(queryString) {
    const rawQuery = `
    UPDATE patient_payments AS t
    SET
      case_id = u.case_id,
      hospital = u.hospital,
      accession_id = u.accession_id,
      cpt_codes = u.cpt_codes,
      line_item_total = u.line_item_total,
      insurance_payment_amount = u.insurance_payment_amount,
      insurance_adjustment_amount = u.insurance_adjustment_amount,
      insurance_write_of_amount = u.insurance_write_of_amount,
      patient_payment_amount = u.patient_payment_amount,
      patient_adjustment_amount = u.patient_adjustment_amount,
      patient_write_of_amount = u.patient_write_of_amount,
      line_item_balance = u.line_item_balance,
      insurance_name = u.insurance_name,
      total_amount = u.total_amount,
      paid_amount = u.paid_amount,
      pending_amount = u.pending_amount,
      difference_values = u.difference_values,
      values_changed = u.values_changed,
      process_status = u.process_status,
      payment_status = u.payment_status,
      date_of_service = u.date_of_service,
      hospital_marketers = u.hospital_marketers
    FROM(
      VALUES

    ${queryString}
    ) as u(case_id, hospital, accession_id, cpt_codes, line_item_total, insurance_payment_amount, insurance_adjustment_amount, insurance_write_of_amount, patient_payment_amount, patient_adjustment_amount, patient_write_of_amount, line_item_balance, insurance_name, total_amount, paid_amount, pending_amount, difference_values, values_changed, process_status, payment_status, date_of_service, hospital_marketers)
    WHERE t.accession_id = u.accession_id AND t.date_of_service = u.date_of_service`

    return this.prisma.$executeRawUnsafe(rawQuery);

  }

  // Revenue Stats
  async insertStats(insertData) {
    return this.prisma.revenue_stats.createMany({ data: insertData });
  }


  async deleteRevenueStats(id) {
    return this.prisma.revenue_stats.deleteMany({
      where: {
        id: id
      }
    })
  }

  async getRevenueStats({ query, select, skip, limit, sort }) {
    return this.prisma.revenue_stats.findMany({
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

  async findAll(query) {

    return await this.prisma.revenue_stats.findMany({
      where: query
    })
  }

  async marketers(query, sort) {

    let data: any = await this.prisma.revenue_stats.groupBy({
      by: ['marketer_id'],
      where: query,
      _sum: {
        total_amount: true,
        paid_amount: true,
        pending_amount: true,
      },
      orderBy: {
        _sum: sort
      }
    })

    return data;
  }


  async updateManyStats(queryString) {
    const rawQuery = `
    UPDATE revenue_stats AS t
    SET
      marketer_id = u.marketer_id,
      date = u.date,
      total_amount = u.total_amount,
      paid_amount = u.paid_amount,
      pending_amount = u.pending_amount,
      case_type_wise_counts = u.case_type_wise_counts,
      hospital_wise_counts = u.hospital_wise_counts
    FROM(
      VALUES

    ${queryString}
    ) as u(marketer_id, date, total_amount, paid_amount, pending_amount, case_type_wise_counts, hospital_wise_counts)
    WHERE t.marketer_id = u.marketer_id AND t.date = u.date`

    return this.prisma.$executeRawUnsafe(rawQuery);

  }
}
