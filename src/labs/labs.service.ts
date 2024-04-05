import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { labs } from 'src/drizzle/schemas/labs';
import { db } from 'src/seeders/db';

@Injectable()
export class LabsService {

    async insertLabs(insertData) {
        const data = await db.insert(labs).values(insertData).returning();

        return data;
    }


    async getLabsByRefIds(refIds) {
        const data = await db.execute(sql`SELECT ref_id FROM labs WHERE ref_id IN ${refIds}`);

        return data.rows;
    }
}
