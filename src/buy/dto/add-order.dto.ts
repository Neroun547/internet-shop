import {IsArray, IsNotEmpty, IsString, Length} from "class-validator";

export class AddOrderDto {
    @IsString()
    @IsNotEmpty()
    contact_info: string;

    @IsArray()
    products: Array<any>;

    @IsString()
    remark: string;

    @IsString()
    @Length(1, 255)
    first_name: string;

    @Length(1, 255)
    @IsString()
    last_name: string;
}
