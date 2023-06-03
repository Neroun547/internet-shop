import { Injectable } from "@nestjs/common";
import { SupportChatServiceDb } from "../../../db/support-chats/support-chats.service";
import { SupportChatMessagesServiceDb } from "../../../db/support-chats/support-chat-messages/support-chat-messages.service";
import { SupportChatUsersServiceDb } from "../../../db/support-chats/support-chat-users/support-chat-users.service";

@Injectable()
export class SupportChatService {
    constructor(
        private supportChatUsersServiceDb: SupportChatUsersServiceDb,
        private supportChatMessagesServiceDb: SupportChatMessagesServiceDb,
        private supportChatsServiceDb: SupportChatServiceDb
    ) {};

    async getMessages(userId: number, take: number, skip: number) {
        const chat = await this.supportChatsServiceDb.getChatByUserId(userId);

        if(chat) {
            const parseData = JSON.parse(JSON.stringify(await this.supportChatMessagesServiceDb.getMessagesByChatIdDESC(chat.id, take, skip)));

            return parseData.sort((a, b) => a.id - b.id);
        }
        await this.supportChatsServiceDb.saveChat(userId);

        return [];
    }

    async saveMessage(message: string, userId: number) {
        const chat = await this.supportChatsServiceDb.getChatByUserId(userId);

        if(chat) {
            await this.supportChatMessagesServiceDb.saveMessage({ admin: false, message: message, chat: chat.id });
        } else {
            await this.supportChatsServiceDb.saveChat(userId);
            const chat = await this.supportChatsServiceDb.getChatByUserId(userId);
            await this.supportChatMessagesServiceDb.saveMessage({ admin: false, message: message, chat: chat.id });
        }
    }

    async getMessagesWhereIdGreater(userId: number, take: number, idMessage: number) {
        const chatId = (await this.supportChatsServiceDb.getChatByUserId(userId)).id;

        return await this.supportChatMessagesServiceDb.getMessagesWhereIdGreater(chatId, take, idMessage);
    }
}

