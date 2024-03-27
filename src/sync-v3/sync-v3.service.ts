import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { patient_claims } from 'src/drizzle/schemas/patientClaims';
import { db } from 'src/seeders/db';

@Injectable()
export class SyncV3Service {


  async insertPatientClaims(data) {
    return db.insert(patient_claims).values(data).returning();
  }


  async getPatientClaims(accesionids) {
    const data = await db.execute(sql`SELECT accession_id FROM patient_claims WHERE accession_id IN ${accesionids}`);

    return data.rows;
  }

  async updateManyPatientClaims(queryString) {

    const rawQuery = sql`
        UPDATE patient_claims AS t
        SET
          accession_id = u.accessionId,
          service_date = u.serviceDate,
          collection_date = u.collectionDate,
          case_type_id = u.caseTypeId,
          patient_id = u.patientId,
          reports_finalized = u.reportsFinalized,
          physician_id = u.physicianId,
          facility_id = u.facilityId,
          sales_rep_id = u.salesRepId,
          insurance_payer_id = u.insurancePayerId
        FROM(
          VALUES

        ${sql.raw(queryString)}
        ) as u(accessionId, serviceDate, collectionDate, caseTypeId, patientId, reportsFinalized, physicianId, facilityId, salesRepId, insurancePayerId)
        WHERE t.accession_id = u.accessionId`;

    return db.execute(rawQuery);
  }


  async removePatientClaims(accesionids) {
    return await db.execute(sql`DELETE FROM patient_claims WHERE accession_id IN ${accesionids}`);
  }
}
