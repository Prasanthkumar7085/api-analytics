import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CaseModel } from "src/schemas/caseSchema";
import { UserModel } from "src/schemas/userSchema";



@Injectable()
export class LisService {
    constructor(
        @InjectModel('User') private userModel: typeof UserModel,
        @InjectModel('Case') private caseModel: typeof CaseModel
    ) { }


    async getUsers(query, projection = {}) {
        return await this.userModel.find(query).select(projection);
    }


    async getCaseByAccessionId(query) {
        return await this.caseModel.find(query).select({
            accession_id: 1, _id: 1, case_types: 1, hospital: 1, hospital_marketers: 1,
            'patient_info._id': 1, 'patient_info.first_name': 1, 'patient_info.last_name': 1,
            'patient_info.middle_name': 1, 'patient_info.address_line_1': 1, 'patient_info.address_line_2': 1,
            'patient_info.city': 1, 'patient_info.state': 1, 'patient_info.zip': 1, collection_date: 1,
            sample_types: 1
        });
    }
}