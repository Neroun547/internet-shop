import {SaveMessageDto} from "../../../support-chat/dto/save-message.dto";
import {IsNumber, IsString, Length} from "class-validator";

export class SaveMessageAdminDto extends SaveMessageDto {
    @IsNumber()
    chatId: number;

    @IsString()
    @Length(1)
    message: string;
}
