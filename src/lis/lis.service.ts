import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CaseModel } from "src/schemas/caseSchema";
import { HospitalModel } from "src/schemas/hospitalSchema";
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
        @InjectModel('Hospital') private hospitalModel: typeof HospitalModel,
    ) { }


    async getUsers(query, select = {}) {
        return await this.userModel.find(query).select(select).lean();
    }


    async getUserById(userId, projection = {}) {
        return await this.userModel.findById(userId).select(projection);
    }


    async getCases(query, select = {}) {
        return await this.caseModel.find(query).select(select);
    }


    async getCaseByAccessionId(query) {
        return await this.caseModel.find(query).select({
            accession_id: 1, _id: 1, case_types: 1, hospital: 1, hospital_marketers: 1,
            'patient_info._id': 1, 'patient_info.first_name': 1, 'patient_info.middle_name': 1, 'patient_info.last_name': 1
        });
    }


    // Fetch insurance data from lis
    async getInsurancePayors(query = {}, projection = {}) {

        //need to get the last 10 days data
        return await this.insuranceModel.find(query).select(projection);

    }


    async getCaseTypes(query = {}, projection = {}) {

        return await this.labTestPanelModel.find(query).select(projection);
    }


    async getFacilities(query, projection) {

        return await this.hospitalModel.find(query).select(projection).lean();
    }


    async getHospitalsData(query) {
        return await this.hospitalModel.find(query);
    }
}
