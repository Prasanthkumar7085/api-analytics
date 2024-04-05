import { date, doublePrecision, index, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { patient_claims } from './patientClaims';

export const patient_claim_payment_history = pgTable('patient_claim_payment_history', {
    id: serial('id').primaryKey(),
    accessionId: varchar("accession_id", { length: 20 }),
    clearedAmount: doublePrecision('cleared_amount').default(0.0),
    paymentDate: date('payment_date'),
    patientId: varchar("patient_id", { length: 30 }),
    patientClaimId: integer("patient_claim_id").references(() => patient_claims.id),
},
    (table: any) => {
        return {
            accessionIdIdx: index("patient_claim_accession_id_idx").on(table.accessionId),
            patientIdIdx: index("patient_claim_patient_id_idx").on(table.patientId),
            patientClaimIdIdx: index("patient_claim_patient_claim_id_idx").on(table.patientClaimId),
        };
    });

