import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/mysql";
import { SupportChats } from "./support-chats.entity";

@Injectable()
export class SupportChatServiceDb {
    constructor(@InjectRepository(SupportChats) private repository: EntityRepository<SupportChats>) {}

    async getChatByUserId(idUser: number) {
        return await this.repository.findOne({ support_chat_user: idUser }, { populate: ["support_chat_user"] });
    }
    async getChatById(id: number) {
        return await this.repository.findOne({ id: id });
    }
    async saveChat(idUser: number) {
        await this.repository.nativeInsert({ support_chat_user: idUser });
    }
    async getChats(skip: number, take: number) {
        return await this.repository.find({  }, { limit: take, offset: skip, populate: ["support_chat_user"] });
    }
    async deleteChatById(id: number) {
        await this.repository.nativeDelete({ id: id });
    }
}

