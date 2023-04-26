import {IsArray, IsNotEmpty, IsString, Length} from "class-validator";

export class AddOrderDto {
    @IsString()
    @IsNotEmpty()
    contact_info: string;

    @IsArray()
    products: Array<any>;

    @IsString()
    remark: string;
}

