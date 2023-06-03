import {SaveMessageDto} from "../../../support-chat/dto/save-message.dto";
import {IsNumber} from "class-validator";

export class SaveMessageAdminDto extends SaveMessageDto {
    @IsNumber()
    chatId: number;
}
