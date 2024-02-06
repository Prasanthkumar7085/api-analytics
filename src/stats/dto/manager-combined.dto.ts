import { IsArray, IsDate, IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class ManagerCombinedDto {

    @IsMongoId({each: true, message: "Invalid Manager"})
    @IsString({message: "Invalid Manager"})
    @IsNotEmpty({message: "Manager is Required"})
    manager_id: string

    @IsMongoId({each: true, message: "Invalid Marketer"})
    @IsArray({message: "Marketer must be an array"})
    @IsOptional()
    marketer_ids:string[];

    @IsDateString({}, {message: "Invalid From Date"})
    @IsNotEmpty({message: "From Date is Required"})
    from_date: Date;

    @IsDateString({}, {message: "Invalid To Date"})
    @IsNotEmpty({message: "To Date is Required"})
    to_date: Date;

    @IsString({message: "Invalid Order By"})
    @IsOptional()
    order_by: string;

    @IsString({message: "Invalid Order Type"})
    @IsOptional()
    order_type: string;
}