import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CaseModel } from "src/schemas/caseSchema";
import { InsurancePayorsModel } from "src/schemas/insurancPayors";
import { UserModel } from "src/schemas/userSchema";



@Injectable()
export class LisService {
    constructor(
        @InjectModel('User') private userModel: typeof UserModel,
        @InjectModel('Case') private caseModel: typeof CaseModel,
        @InjectModel('InsurancePayors') private insurancePayorModel: typeof InsurancePayorsModel
    ) { }


    async getUsers(query, select = {}) {
        return await this.userModel.find(query).select(select);
    }


    async getCases(query, select = {}) {
        return await this.caseModel.find(query).select(select);
    }

    async getInsurancePayors(){
        return await this.insurancePayorModel.find();
    }
}