
import { integer, serial, text, pgTable, boolean, varchar, doublePrecision, date } from 'drizzle-orm/pg-core';


export const user_role = pgTable('user_role', {
    id: serial('id').primaryKey(),
    name: text('name'),
});