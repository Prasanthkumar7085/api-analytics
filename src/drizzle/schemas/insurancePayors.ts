
import { integer, serial, text, pgTable, boolean, varchar, doublePrecision, date } from 'drizzle-orm/pg-core';


export const insurance_payors = pgTable('insurance_payors', {
    id: serial('id').primaryKey(),
    name: text('name'),
    refId: text('ref_id'),// mongodbid
});