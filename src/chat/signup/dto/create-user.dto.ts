import {IsString, Length} from "class-validator";
import {ChatUsersInterface} from "../../../../db/chat-users/interfaces/chat-users.interface";

export class CreateUserDto implements ChatUsersInterface {
    @IsString()
    @Length(1, 30, { message: "Ім'я користувача має містити від 1 до 30 символів" })
    username: string;

    @IsString()
    @Length(6, 30, { message: "Пароль має містити від 6 до 30 символів" })
    password: string;
}
