import { Injectable } from '@nestjs/common';
import { labs } from 'src/drizzle/schemas/labs';
import { CaseModel } from 'src/schemas/caseSchema';
import { LabModel } from 'src/schemas/lab';
import { UserModel } from 'src/schemas/userSchema';
import { db } from 'src/seeders/db';

@Injectable()
export class MghSyncService {
    constructor(
    ) { }


    async getUsers(query, select = {}) {
        return await UserModel.find(query).select(select).lean();
    }


    async getUserById(userId, projection = {}) {
        return await UserModel.findById(userId).select(projection);
    }


    async getCases(query, select = {}) {
        return await CaseModel.find(query).select(select);
    }

    async getlabs(query = {}, select = {}) {
        return await LabModel.find(query).select(select).lean();
    }


    async insertLabs(insertData) {
        const data = await db.insert(labs).values(insertData).returning();

        return data;
    }

}
