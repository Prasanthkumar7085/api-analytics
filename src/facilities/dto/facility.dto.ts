import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FacilityDto {

    @IsMongoId({ each: true, message: "Invalid Facility" })
    @IsString({ message: "Invalid Facility" })
    @IsNotEmpty({ message: "Facility is Required" })
    hospital_id: string

    @IsDateString({}, { message: "Invalid From Date" })
    // @IsNotEmpty({message: "From Date is Required"})
    @IsOptional()
    from_date: Date;

    @IsDateString({}, { message: "Invalid To Date" })
    // @IsNotEmpty({message: "To Date is Required"})
    @IsOptional()
    to_date: Date;
}
