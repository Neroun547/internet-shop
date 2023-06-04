import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {SupportChatUsers} from "./support-chat-users.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {SupportChatUsersInterface} from "./interfaces/support-chat-users.interface";

@Injectable()
export class SupportChatUsersServiceDb {
    constructor(@InjectRepository(SupportChatUsers) private repository: EntityRepository<SupportChatUsers>) {}

    async createUser(user: SupportChatUsersInterface) {
        await this.repository.nativeInsert(user);
    }
    async getUserByUsername(username: string) {
        return await this.repository.findOne({ username: username });
    }
}
