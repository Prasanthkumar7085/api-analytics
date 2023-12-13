import {IsString,IsEmail, IsMongoId, IsDate, IsDateString} from 'class-validator'
export class CreateStatDto {

    @IsMongoId()
    marketerId:string;

    @IsMongoId()
    hospitalId : string;

    @IsString()
    date : string;

    @IsString()
    caseType : string;
}

