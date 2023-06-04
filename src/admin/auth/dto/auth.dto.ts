import {IsString} from "class-validator";

export class AuthDto {
    @IsString()
    name: string;

    @IsString()
    password: string;
}
