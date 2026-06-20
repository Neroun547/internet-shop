import { Injectable, NotFoundException } from "@nestjs/common";
import {SupportChatServiceDb} from "../../../db/support-chats/support-chats.service";
import {
    SupportChatMessagesServiceDb
} from "../../../db/support-chats/support-chat-messages/support-chat-messages.service";
import {SaveMessageAdminDto} from "../dto/save-message-admin.dto";
import * as Moment from "moment";
import { SupportChats } from "src/db/support-chats/support-chats.entity";

@Injectable()
export class SupportChatServiceAdmin {
    constructor(
        private supportChatServiceDb: SupportChatServiceDb,
        private supportChatMessagesServiceDb: SupportChatMessagesServiceDb
    ) {}

    async getChats(skip: number, take: number) {
        const chats = await this.supportChatServiceDb.getChats(skip, take);

        return (await this.checkExistsMessagesInChats(chats)).map(el => ({ id: el.id, username: el.support_chat_user.username }));
    }

    async getMessagesByChatId(chatId: number, take: number, skip: number) {
        const messages = (await this.supportChatMessagesServiceDb.getMessagesByChatIdDESC(chatId, take, skip)).sort((a, b) => {
            if(a.id && b.id) return a.id - b.id;

            return -1;
        });

        return messages.map(el => {
            return { ...el, date: el.date ? Moment(el.date).format("YYYY-MM-DD HH:mm:ss") : "" }
        });
    }

    async saveMessage(data: SaveMessageAdminDto) {
        const chat = await this.supportChatServiceDb.getChatById(data.chatId);

        if(!chat) {
            throw new NotFoundException({ message: "Chat not found" });
        }
        await this.supportChatMessagesServiceDb.saveMessage({ message: data.message, admin: true, chat: chat.id, date: Moment().format("YYYY-MM-DD HH:mm:ss") });
    }

    async getMessagesWhereIdGreater(chatId: number, take: number, idMessage: number) {
        return (await this.supportChatMessagesServiceDb.getMessagesWhereIdGreater(chatId, take, idMessage, false)).map(el => ({ ...el, date: el.date ? Moment(el.date).format("YYYY-MM-DD HH:mm:ss") : "" }));
    }

    async deleteChat(chatId: number) {
        await this.supportChatMessagesServiceDb.deleteMessagesByChatId(chatId);
        await this.supportChatServiceDb.deleteChatById(chatId);
    }

    async checkExistsMessagesInChats(chats: Array<SupportChats>) {
        const result: Array<SupportChats> = [];

        for(let i = 0; i < chats.length; i++) {
            if((await this.supportChatMessagesServiceDb.getCountMessagesByChatId(chats[i].id)) >= 1) {
                result.push(chats[i]);
            }
        }
        return result;
    }
}
