import { IsNotEmpty, IsString } from "class-validator";

export class SigninDto {

    @IsString({ message: "User Name is Invalid!" })
    @IsNotEmpty({ message: "User Name is Required" })
    user_name: string;

    @IsString({ message: "Password is Invalid!" })
    @IsNotEmpty({ message: "Password is Required" })
    password: string;
}
