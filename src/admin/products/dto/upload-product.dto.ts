import {IsInt, IsNumber, IsString, Length} from "class-validator";

export class UploadProductDto {
    @IsString()
    @Length(1, 80)
    name: string;

    @IsString()
    @Length(0, 500)
    description: string;

    @IsNumber()
    price: number;

    @IsInt()
    available: number;
}
