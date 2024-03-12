
import { integer, serial, text, pgTable, boolean, varchar, doublePrecision, date } from 'drizzle-orm/pg-core';
import { user_role } from './userRole';

export const sales_reps = pgTable('sales_reps', {
    id: serial('id').primaryKey(),
    name: text('name'),
    refId: text('ref_id'),// mongodbid
    reportingTo: serial('reporting_to'),
    roleId: integer("role_id").references(() => user_role.id),
});