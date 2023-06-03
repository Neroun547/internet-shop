import {ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import { SupportChatUsersInterface } from "../../../../db/support-chats/support-chat-users/interfaces/support-chat-users.interface";
import * as argon2 from "argon2";
import { SupportChatUsersServiceDb } from "../../../../db/support-chats/support-chat-users/support-chat-users.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class SupportChatAuthService {
    constructor(
        private chatUsersServiceDb: SupportChatUsersServiceDb,
        private jwtService: JwtService
    ) {}

    async auth(user: SupportChatUsersInterface): Promise<string> {
        const userInDb = await this.chatUsersServiceDb.getUserByUsername(user.username);

        if(!userInDb) {
            throw new ForbiddenException({ message: "Не вірне ім'я користувача або пароль" });
        }
        const checkPassword = await argon2.verify(userInDb.password, user.password)
        ;
        if(checkPassword) {
            return this.jwtService.sign(JSON.parse(JSON.stringify(userInDb)), { secret: process.env.SECRET_JWT_CHAT_AUTH });
        }
        throw new UnauthorizedException({ message: "Не вірне ім'я користувача або пароль" });
    }
}

