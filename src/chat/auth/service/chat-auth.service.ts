import {ForbiddenException, Injectable} from "@nestjs/common";
import {ChatUsersInterface} from "../../../../db/chat-users/interfaces/chat-users.interface";
import * as argon2 from "argon2";
import {ChatUsersServiceDb} from "../../../../db/chat-users/chat-users.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class ChatAuthService {
    constructor(
        private chatUsersServiceDb: ChatUsersServiceDb,
        private jwtService: JwtService
    ) {}

    async auth(user: ChatUsersInterface): Promise<string> {
        const userInDb = await this.chatUsersServiceDb.getUserByUsername(user.username);

        if(!userInDb) {
            throw new ForbiddenException();
        }
        if((await argon2.verify(userInDb.password, user.password))) {
            return this.jwtService.sign(JSON.parse(JSON.stringify(userInDb)), { secret: process.env.SECRET_JWT_CHAT_AUTH });
        }
    }
}

