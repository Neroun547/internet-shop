import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {SupportChatMessages} from "./support-chat-messages.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {SupportChatMessagesInterface} from "./interfaces/support-chat-messages.interface";
import { SupportChatMessagesMapper } from "./support-chat-messages.mapper";

@Injectable()
export class SupportChatMessagesServiceDb {
    constructor(@InjectRepository(SupportChatMessages) private repository: EntityRepository<SupportChatMessages>) {}

    async saveMessage(message: SupportChatMessagesInterface): Promise<void> {
        await this.repository.insert(SupportChatMessagesMapper.toPersist(message));
    }

    async getMessagesByChatIdDESC(chatId: number, take: number, skip: number): Promise<SupportChatMessagesInterface[]> {
        const data = (await this.repository.find({ chat: chatId }, { limit: take, offset: skip, orderBy: { id: "DESC" } }));

        return data.map(item => SupportChatMessagesMapper.toDomain(item));
    }

    async getMessagesWhereIdGreater(chatId: number, take: number, messageId: number, admin=true): Promise<SupportChatMessagesInterface[]> {
        const data = await this.repository.find({ chat: chatId, admin: admin, id: { $gt: messageId } }, { limit: take });

        return data.map(item => SupportChatMessagesMapper.toDomain(item));
    }

    async deleteMessagesByChatId(chatId: number): Promise<void> {
        await this.repository.nativeDelete({ chat: chatId });
    }

    async getCountMessagesByChatId(chatId: number): Promise<number> {
        return await this.repository.count({ chat: chatId });
    }
}
