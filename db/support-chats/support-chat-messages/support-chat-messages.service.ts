import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {SupportChatMessages} from "./support-chat-messages.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {SupportChatMessagesInterface} from "./interfaces/support-chat-messages.interface";

@Injectable()
export class SupportChatMessagesServiceDb {
    constructor(@InjectRepository(SupportChatMessages) private repository: EntityRepository<SupportChatMessages>) {}

    async saveMessage(message: SupportChatMessagesInterface) {
        await this.repository.nativeInsert(message);
    }

    async getMessagesByChatIdDESC(chatId: number, take: number, skip: number) {
        return (await this.repository.find({ chat: chatId }, { limit: take, offset: skip, orderBy: { id: "DESC" } }));
    }

    async getMessagesWhereIdGreater(chatId: number, take: number, messageId: number, admin=true) {
        return await this.repository.find({ chat: chatId, admin: admin, id: { $gt: messageId } }, { limit: take });
    }
}
