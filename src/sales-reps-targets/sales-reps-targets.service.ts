import { Injectable } from '@nestjs/common';
import { sales_reps_targets } from 'src/drizzle/schemas/salesRepsTargets';
import { db } from '../seeders/db';
import { patient_claims } from 'src/drizzle/schemas/patientClaims';
import { sql } from 'drizzle-orm';

@Injectable()
export class SalesRepsTargetsService {

  async getAllSalesRepsTargets() {
    return await db.select().from(sales_reps_targets).orderBy(sales_reps_targets.id);
  }

}
