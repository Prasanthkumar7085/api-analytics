import { boolean, date, doublePrecision, index, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { case_types } from './caseTypes';
import { facilities } from './facilities';
import { insurance_payors } from './insurancePayors';
import { labs } from './labs';
import { sales_reps } from './salesReps';
import { sql } from 'drizzle-orm';

export const patient_claims = pgTable('patient_claims', {
    id: serial('id').primaryKey(),
    accessionId: varchar("accession_id", { length: 20 }),
    caseTypeId: integer("case_type_id").references(() => case_types.id),
    physicianId: varchar("physician_id", { length: 30 }),
    facilityId: integer("facility_id").references(() => facilities.id),
    salesRepId: integer("sales_rep_id").references(() => sales_reps.id),
    insurancePayerId: integer("insurance_payer_id").references(() => insurance_payors.id),
    expectedAmount: doublePrecision('expected_amount').default(0.0),
    billableAmount: doublePrecision('billable_amount').default(0.0),
    clearedAmount: doublePrecision('cleared_amount').default(0.0),
    pendingAmount: doublePrecision('pending_amount').default(0.0),
    serviceDate: date('service_date'),
    collectionDate: date('collection_date'),
    reportsFinalized: boolean('reports_finalized').default(false),
    isBillCleared: boolean('is_bill_cleared').default(false),
    recentPaymentDate: date('recent_payment_date'),
    insurnaceTargetPrice: doublePrecision('insurnace_target_price').default(0.0),
    patientId: varchar("patient_id", { length: 30 }),
    isPartialPaid: boolean("is_partial_paid").default(false),
    billingDate: date('billing_date'),
    labId: integer("lab_id").references(() => labs.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
},
    (table: any) => {
        return {
            accessionIdIdx: index("accession_id_idx").on(table.accessionId),
            caseTypeIdIdx: index("case_type_id_idx").on(table.caseTypeId),
            physicianIdIdx: index("physician_id_idx").on(table.physicianId),
            facilityIdIdx: index("facility_id_idx").on(table.facilityId),
            salesRepIdIdx: index("sales_rep_id_idx").on(table.salesRepId),
            insurancePayerIdIdx: index("insurance_payer_id_idx").on(table.insurancePayerId),
            patientIdIdx: index("patient_id_idx").on(table.patientId),
            labIdIdx: index("lab_id_idx").on(table.labId)
        };
    });


