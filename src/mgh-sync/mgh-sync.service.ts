import { Injectable } from '@nestjs/common';
import { CaseModel } from 'src/schemas/caseSchema';
import { HospitalModel } from 'src/schemas/hospitalSchema';
import { InsurancePayorsModel } from 'src/schemas/insurancPayors';
import { LabModel } from 'src/schemas/lab';
import { UserModel } from 'src/schemas/userSchema';

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

    async getFacilities(query, projection) {
        return await HospitalModel.find(query).select(projection).lean();
    }


    async getInsurancePayors(query = {}, projection = {}) {
        return await InsurancePayorsModel.find(query).select(projection);

    }
}
