import {IsString,IsEmail, IsMongoId, IsDate, IsDateString} from 'class-validator'
export class CreateStatDto {

    @IsMongoId()
    marketer_id:string;

    @IsMongoId()
    hospital_id : string;

    @IsString()
    date : string;

    @IsString()
    case_type : string;
}

