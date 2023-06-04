import {IsString, Length} from "class-validator";

export class SaveMessageDto {
    @IsString()
    @Length(1)
    message: string;
}
