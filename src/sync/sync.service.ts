import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { patient_claims } from 'src/drizzle/schemas/patientClaims';
import { db } from 'src/seeders/db';

@Injectable()
export class SyncService {


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
          insurance_payer_id = u.insurancePayerId,
          lab_id = u.labId
        FROM(
          VALUES

        ${sql.raw(queryString)}
        ) as u(accessionId, serviceDate, collectionDate, caseTypeId, patientId, reportsFinalized, physicianId, facilityId, salesRepId, insurancePayerId, labId)
        WHERE t.accession_id = u.accessionId`;

    return db.execute(rawQuery);
  }


  async removePatientClaims(accesionids) {
    return await db.execute(sql`DELETE FROM patient_claims WHERE accession_id IN ${accesionids}`);
  }

  async getCaseTypesVolume() {

		// This query calculates the total no.of cases, grouped by month and case-type for a specific sales representative.
		let query = sql`
            SELECT 
                p.sales_rep_id,
                p.facility_id,
                p.case_type_id,
                UPPER(c.name) AS case_type,
                TO_CHAR(p.service_date, 'Mon YYYY') AS month,
                CAST(COUNT(DISTINCT p.facility_id) AS INTEGER) AS facility_count,  -- Aggregate the counts of unique facility_id
				        CAST(COUNT(*) AS INTEGER) AS total_cases
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
			      GROUP BY 
                p.sales_rep_id,
			      	  TO_CHAR(service_date, 'Mon YYYY'), 
			      	  p.case_type_id, 
			      	  case_type,
                p.facility_id;
            `;

		const data = await db.execute(query);

		return data.rows;
	}
}
