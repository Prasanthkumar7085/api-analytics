
import { index, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const labs = pgTable('labs', {
    id: serial('id').primaryKey(),
    name: text('name'),
    code: text('code'),
    refId: varchar('ref_id').default(null),// mongodbid
}, (table: any) => {
    return {
        labRefIdIdx: index("lab_ref_id_idx").on(table.refId)
    };
});
