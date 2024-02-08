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
        return await this.caseModel.find(query).select({ accession_id: 1, _id: 1, case_types: 1, hospital: 1, hospital_marketers: 1 });
    }
}