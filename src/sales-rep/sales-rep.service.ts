import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import { sales_reps } from 'src/drizzle/schemas/salesReps';
import { db } from 'src/seeders/db';
import { facilities } from 'src/drizzle/schemas/facilities';
import { case_types } from 'src/drizzle/schemas/caseTypes';
import { patient_claims } from 'src/drizzle/schemas/patientClaims';
import { sql } from 'drizzle-orm';
import { insurance_payors } from 'src/drizzle/schemas/insurancePayors';
import insurancePayors from 'src/seeders/insurancePayors';

@Injectable()
export class SalesRepService {

  async getInsurance() {
    const data = await db.select().from(insurance_payors)

    return data
  }


  async getSalesRep() {
    const sales = await db.select().from(sales_reps)

    console.log(sales)
    return sales
  }
  async getFacilities() {
    const sales = await db.select().from(facilities)

    console.log(sales)
    return sales
  }
  async getCaseTypes() {
    const sales = await db.select().from(case_types)

    console.log(sales)
    return sales
  }


  async getSalesRepStatsVolume() {
    const sales = await db.select().from(sales_reps)

    console.log(sales)
    return sales
  }
  async getSalesRepPatientClaims() {
    const sales = await db.select().from(patient_claims)

    console.log(sales)
    return sales
  }


  async getStatsRevenue(id, query) {
    // Write raw SQL query to join and calculate totals
    let { from_date, to_date } = query;

    // Ensure that from_date and to_date are valid dates, if provided
    if (from_date) from_date = new Date(from_date);
    if (to_date) to_date = new Date(to_date);


    // Check if the provided id exists in the database
    // const salesRepExists = await db.execute(sql`
    //     SELECT COUNT(*) AS count
    //     FROM ${sales_reps}
    //     WHERE id = ${id}
    // `);

    // if (salesRepExists.rows.length === 0) {
    //   throw new NotFoundException('Sales Representative not found');
    // }


    // Build the SQL query with optional date filter
    let statement = sql`
      SELECT 
        ROUND(SUM(${patient_claims.billableAmount})::NUMERIC, 2) AS billed,
        ROUND(SUM(${patient_claims.clearedAmount})::NUMERIC, 2) AS collected,
        ROUND(SUM(${patient_claims.pendingAmount})::NUMERIC, 2) AS pending
      FROM 
        ${sales_reps}
      LEFT JOIN 
        ${patient_claims} ON ${sales_reps.id} = ${patient_claims.salesRepId}
      WHERE 
        ${sales_reps.id} = ${id}
    `;

    // Conditionally add the date filter if both from_date and to_date are provided
    if (from_date && to_date) {
      statement.append(sql`
        AND ${patient_claims.serviceDate} BETWEEN ${from_date} AND ${to_date}
      `);
    }

    statement.append(sql`
      GROUP BY 
        ${sales_reps.id};
    `);

    // Execute the raw SQL query
    const data = await db.execute(statement);

    return data.rows[0];
  }



  async getInsurancePayers(id, query) {

    let { from_date, to_date } = query;

    if (from_date) from_date = new Date(from_date);
    if (to_date) to_date = new Date(to_date);


    // const salesRepExists = await db.execute(sql`
    //     SELECT COUNT(*) AS count
    //     FROM ${sales_reps}
    //     WHERE id = ${id}
    // `);
    // console.log({ salesRepExists })
    // if (salesRepExists.rows.length === 0) {
    //   throw new NotFoundException('Sales Representative not found');
    // }


    let statement = sql`
    SELECT 
        ${insurance_payors.name} AS insurance_name,
        ROUND(SUM(${patient_claims.billableAmount})::NUMERIC, 2) AS total,
        ROUND(SUM(${patient_claims.clearedAmount})::NUMERIC, 2) AS paid,
        ROUND(SUM(${patient_claims.pendingAmount})::NUMERIC, 2) AS pending
    FROM ${sales_reps}
    JOIN ${patient_claims} ON ${patient_claims.salesRepId} = ${sales_reps.id}
    JOIN ${insurance_payors} ON ${patient_claims.insurancePayerId} = ${insurance_payors.id}
    WHERE ${sales_reps.id} = ${id}

    
    `;


    // Conditionally add the date filter if both from_date and to_date are provided
    if (from_date && to_date) {
      statement.append(sql`
        AND ${patient_claims.serviceDate} BETWEEN ${from_date} AND ${to_date}
      `);
    }

    statement.append(sql`
      GROUP BY 
        ${insurance_payors.name};
    `);

    // Execute the raw SQL query
    const data = await db.execute(statement);


    return data.rows;


  }

}
