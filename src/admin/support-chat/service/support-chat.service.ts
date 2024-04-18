import { Injectable } from "@nestjs/common";
import {SupportChatServiceDb} from "../../../../db/support-chats/support-chats.service";
import {
    SupportChatMessagesServiceDb
} from "../../../../db/support-chats/support-chat-messages/support-chat-messages.service";
import {SaveMessageAdminDto} from "../dto/save-message-admin.dto";
import * as Moment from "moment";

@Injectable()
export class SupportChatServiceAdmin {
    constructor(
        private supportChatServiceDb: SupportChatServiceDb,
        private supportChatMessagesServiceDb: SupportChatMessagesServiceDb
    ) {}

    async getChats(skip: number, take: number) {
        const chats = JSON.parse(JSON.stringify(await this.supportChatServiceDb.getChats(skip, take)));

        return (await this.checkExistsMessagesInChats(chats)).map(el => ({ id: el.id, username: el.support_chat_user.username }));
    }

    async getMessagesByChatId(chatId: number, take: number, skip: number) {
        const messages = JSON.parse(JSON.stringify(await this.supportChatMessagesServiceDb.getMessagesByChatIdDESC(chatId, take, skip))).sort((a, b) => a.id - b.id);

        return messages.map(el => {
            return { ...el, date: el.date ? Moment(el.date).format("YYYY-MM-DD HH:mm:ss") : "" }
        });
    }

    async saveMessage(data: SaveMessageAdminDto) {
        const chat = await this.supportChatServiceDb.getChatById(data.chatId);
        await this.supportChatMessagesServiceDb.saveMessage({ message: data.message, admin: true, chat: chat.id, date: Moment().format("YYYY-MM-DD HH:mm:ss") });
    }

    async getMessagesWhereIdGreater(chatId: number, take: number, idMessage: number) {
        return (await this.supportChatMessagesServiceDb.getMessagesWhereIdGreater(chatId, take, idMessage, false)).map(el => ({ ...el, date: el.date ? Moment(el.date).format("YYYY-MM-DD HH:mm:ss") : "" }));
    }

    async deleteChat(chatId: number) {
        await this.supportChatMessagesServiceDb.deleteMessagesByChatId(chatId);
        await this.supportChatServiceDb.deleteChatById(chatId);
    }

    async checkExistsMessagesInChats(chats) {
        const result = [];

        for(let i = 0; i < chats.length; i++) {
            if((await this.supportChatMessagesServiceDb.getCountMessagesByChatId(chats[i].id)) >= 1) {
                result.push(chats[i]);
            }
        }
        return result;
    }
}
