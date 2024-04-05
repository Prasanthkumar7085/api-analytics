import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CaseModel } from 'src/schemas/caseSchema';
import { UserModel } from 'src/schemas/userSchema';

@Injectable()
export class MghSyncService {
    constructor(
        @InjectModel('User') private userModel: typeof UserModel,
        @InjectModel('Case') private caseModel: typeof CaseModel,
        // @InjectModel('Insurance_Payors') private insuranceModel: typeof InsurancePayorsModel,
        // @InjectModel('Test_Panels') private labTestPanelModel: typeof LabTestPanelModel,
        // @InjectModel('Hospital') private hospitalModel: typeof HospitalModel,
    ) { }


    async getUsers(query, select = {}) {
        return await this.userModel.find(query).select(select).lean();
    }


    async getUserById(userId, projection = {}) {
        return await this.userModel.findById(userId).select(projection);
    }


    async getCases(query, select = {}) {
        return await CaseModel.find(query).select(select);
    }

}
