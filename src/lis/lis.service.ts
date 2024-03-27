import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CaseModel } from "src/schemas/caseSchema";
import { InsurancePayorsModel } from "src/schemas/insurancPayors";
import { LabTestPanelModel } from "src/schemas/testPanelSchema";
import { UserModel } from "src/schemas/userSchema";



@Injectable()
export class LisService {
    constructor(
        @InjectModel('User') private userModel: typeof UserModel,
        @InjectModel('Case') private caseModel: typeof CaseModel,
        @InjectModel('Insurance_Payors') private insuranceModel: typeof InsurancePayorsModel,
        @InjectModel('Test_Panels') private labTestPanelModel: typeof LabTestPanelModel,
    ) { }


    async getUsers(query, projection = {}) {
        return await this.userModel.find(query).select(projection);
    }


    async getCaseByAccessionId(query) {
        return await this.caseModel.find(query).select({
            accession_id: 1, _id: 1, case_types: 1, hospital: 1, hospital_marketers: 1,
            'patient_info._id': 1, 'patient_info.first_name': 1, 'patient_info.middle_name': 1, 'patient_info.last_name': 1
        });
    }


    // Fetch insurance data from lis
    async getInsurancePayors() {

        //need to get the last 10 days data
        return await this.insuranceModel.find().select('_id name');

    }

    // REVIEW: convert select as dynamically
    async getCaseTypes(query: any) {

        return await this.labTestPanelModel.find(query).select('name code');
    }

}

