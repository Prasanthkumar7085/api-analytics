import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class SalesRepDto {

    @IsDateString({}, {message: "Invalid From Date"})
    // @IsNotEmpty({message: "From Date is Required"})
    @IsOptional()
    from_date: Date;

    @IsDateString({}, {message: "Invalid To Date"})
    // @IsNotEmpty({message: "To Date is Required"})
    @IsOptional()
    to_date: Date;

    @IsString({message: "Invalid Order By"})
    @IsOptional()
    order_by: string;

    @IsString({message: "Invalid Order Type"})
    @IsOptional()
    order_type: string;
}