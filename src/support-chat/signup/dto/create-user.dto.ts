import {IsString, Length} from "class-validator";
import { SupportChatUsersInterface } from "../../../../db/support-chats/support-chat-users/interfaces/support-chat-users.interface";

export class CreateUserDto implements SupportChatUsersInterface {
    @IsString()
    @Length(1, 30, { message: "Ім'я користувача має містити від 1 до 30 символів" })
    username: string;

    @IsString()
    @Length(6, 30, { message: "Пароль має містити від 6 до 30 символів" })
    password: string;
}
