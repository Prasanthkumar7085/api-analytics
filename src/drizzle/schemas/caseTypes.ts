
import { sql } from 'drizzle-orm';
import { index, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';


const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);

export const case_types = pgTable('case_types', {
    id: serial('id').primaryKey(),
    name: text('name'),
    displayName: text('display_name'),
    status: statusEnum('status').default("ACTIVE"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table: any) => {
    return {
        caseTypesNameIdx: index("case_types_name_idx").on(table.name),
        caseTypesStatusIdx: index("case_types_status_idx").on(table.status)
    };
});
