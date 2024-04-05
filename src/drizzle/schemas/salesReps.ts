
import { index, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { user_role } from './userRole';

export const sales_reps = pgTable('sales_reps', {
    id: serial('id').primaryKey(),
    name: text('name'),
    refId: text('ref_id'),// mongodbid
    mghRefId: text('mgh_ref_id'),// mongodbid
    reportingTo: serial('reporting_to'),
    roleId: integer("role_id").references(() => user_role.id),
}, (table: any) => {
    return {
        salesRepMghRefIdIdx: index("sales_rep_mgh_ref_id_idx").on(table.mghRefId),
        salesRepRefIdIdx: index("sales_rep_ref_id_idx").on(table.refId)
    };
});
