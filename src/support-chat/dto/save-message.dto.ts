import {IsString} from "class-validator";

export class SaveMessageDto {
    @IsString()
    message: string;
}
