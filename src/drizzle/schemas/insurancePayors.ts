import { index, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const insurance_payors = pgTable('insurance_payors', {
    id: serial('id').primaryKey(),
    name: text('name'),
    refId: text('ref_id').default(null),// mongodbid
    mghRefId: text('mgh_ref_id').default(null),// mongodbid
}, (table: any) => {
    return {
        insuranceMghRefIdIdx: index("insurance_mgh_ref_id_idx").on(table.mghRefId),
        insuranceRefIdIdx: index("insurance_ref_id_idx").on(table.refId)
    };
});
