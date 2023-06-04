import {BadRequestException, Injectable} from "@nestjs/common";
import {SupportChatUsersInterface} from "../../../../db/support-chats/support-chat-users/interfaces/support-chat-users.interface";
import * as argon2 from "argon2";
import {SupportChatUsersServiceDb} from "../../../../db/support-chats/support-chat-users/support-chat-users.service";

@Injectable()
export class SupportChatSignupService {
    constructor(private chatUsersServiceDb: SupportChatUsersServiceDb) {}

    async createUser(user: SupportChatUsersInterface) {
        const userInDb = await this.chatUsersServiceDb.getUserByUsername(user.username);

        if(userInDb) {
            throw new BadRequestException({ message: "Користувач з таким ім'ям вже існує" });
        }
        const saveUser: SupportChatUsersInterface = { ...user };

        saveUser.password = await argon2.hash(user.password);

        await this.chatUsersServiceDb.createUser(saveUser);
    }
}
