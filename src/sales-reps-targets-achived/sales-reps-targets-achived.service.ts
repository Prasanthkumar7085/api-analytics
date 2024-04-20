import { Injectable } from '@nestjs/common';
import { sales_reps_monthly_achieves } from 'src/drizzle/schemas/salesRepsMonthlyAchieves';
import { db } from 'src/seeders/db';


@Injectable()
export class SalesRepsTargetsAchivedService {
  insert(data) {
    return db.insert(sales_reps_monthly_achieves).values(data).returning();
  }

  findAll() {
    return `This action returns all salesRepsTargetsAchived`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salesRepsTargetsAchived`;
  }

  update(id: number) {
    return `This action updates a #${id} salesRepsTargetsAchived`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesRepsTargetsAchived`;
  }
}
