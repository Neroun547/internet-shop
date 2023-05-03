import {BadRequestException, Injectable} from "@nestjs/common";
import {ChatUsersServiceDb} from "../../../db/chat-users/chat-users.service";
import {ChatUsersInterface} from "../../../db/chat-users/interfaces/chat-users.interface";
import * as argon2 from "argon2";

@Injectable()
export class ChatService {
    constructor(private chatUsersServiceDb: ChatUsersServiceDb) {};

    async createUser(user: ChatUsersInterface) {
        const userInDb = await this.chatUsersServiceDb.getUserByUsername(user.username);

        if(userInDb) {
            throw new BadRequestException({ message: "Користувач з таким ім'ям вже існує" });
        }
        const saveUser: ChatUsersInterface = { ...user };

        saveUser.password = await argon2.hash(user.password);

        await this.chatUsersServiceDb.createUser(saveUser);
    }
}
