import {IsString,IsEmail, IsMongoId, IsDate, IsDateString, IsArray, IsNotEmpty} from 'class-validator'
export class CreateStatDto {

    @IsMongoId({each: true, message: "Invalid Marketer Ids"})
    @IsArray({message: "Marketer Ids must be an array"})
    @IsNotEmpty({message: "Marketer Ids is required"})
    marketer_ids:string[];

    @IsMongoId({message: "Invalid Hospital Id"})
    @IsNotEmpty({message: "Hospital Id is required"})
    hospital_id : string;

    @IsString({message: "Invalid Date"})
    @IsNotEmpty({message: "Date is required"})
    date : string;

    @IsString({message: "Invalid Case Type"})
    @IsNotEmpty({message: "Case Type is required"})
    case_type : string;
}

