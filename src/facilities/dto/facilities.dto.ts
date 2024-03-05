import { IsDateString, IsOptional } from "class-validator";

export class FacilitiesDto {

    @IsDateString({}, { message: "Invalid From Date" })
    // @IsNotEmpty({message: "From Date is Required"})
    @IsOptional()
    from_date: Date;

    @IsDateString({}, { message: "Invalid To Date" })
    // @IsNotEmpty({message: "To Date is Required"})
    @IsOptional()
    to_date: Date;
}
