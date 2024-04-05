
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const case_types = pgTable('case_types', {
    id: serial('id').primaryKey(),
    name: text('name'),
    displayName: text('display_name'),
});
