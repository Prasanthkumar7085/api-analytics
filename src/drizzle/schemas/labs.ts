
import { sql } from 'drizzle-orm';
import { index, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';


const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);

export const labs = pgTable('labs', {
    id: serial('id').primaryKey(),
    name: text('name'),
    code: text('code'),
    refId: varchar('ref_id').default(null),// mongodbid
    status: statusEnum('status').default("ACTIVE"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table: any) => {
    return {
        labRefIdIdx: index("lab_ref_id_idx").on(table.refId),
        labStatusIdx: index("lab_status_idx").on(table.status)
    };
});
