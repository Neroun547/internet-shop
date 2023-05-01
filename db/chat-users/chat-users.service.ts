import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {ChatUsers} from "./chat-users.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {ChatUsersInterface} from "./interfaces/chat-users.interface";

@Injectable()
export class ChatUsersServiceDb {
    constructor(@InjectRepository(ChatUsers) private repository: EntityRepository<ChatUsers>) {}

    async createUser(user: ChatUsersInterface) {
        await this.repository.nativeInsert(user);
    }
    async getUserByUsername(username: string) {
        return await this.repository.findOne({ username: username });
    }
}
