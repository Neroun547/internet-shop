import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards} from "@nestjs/common";
import { Response, Request } from "express";
import {SupportChatServiceAdmin} from "./service/support-chat.service";
import {AuthGuard} from "../auth/guards/auth.guard";
import {SaveMessageAdminDto} from "./dto/save-message-admin.dto";
import {SupportChatAuthGuard} from "../../support-chat/auth/guards/support-chat-auth.guard";

@Controller()
export class SupportChatControllerAdmin {
    constructor(private supportChatsServiceAdmin: SupportChatServiceAdmin) {
    }

    @UseGuards(AuthGuard)
    @Get()
    async getChatsPage(@Res() res: Response) {
        const chats = await this.supportChatsServiceAdmin.getChats(0, 5);

        res.render("admin/support-chats/support-chats", {
            auth: true,
            admin: true,
            chats: chats,
            styles: ["/css/admin/support-chats/support-chats.css"],
            scripts: ["/js/admin/chat/chats.js"]
        });
    }

    @UseGuards(AuthGuard)
    @Get(":id")
    async getChatPage(@Param("id", new ParseIntPipe()) id: number, @Res() res: Response) {
        const messages = await this.supportChatsServiceAdmin.getMessagesByChatId(id, 10, 0);

        res.render("admin/support-chats/support-chat", {
            styles: ["/css/chat/chat.css", "/css/chat-media.css"],
            scripts: ["/js/admin/chat/chat.js", "/js/admin/chat/chats.js"],
            messages: messages,
            admin: true,
            auth: true,
            chatId: id,
            idLastMessage: messages[messages.length - 1] ? messages[messages.length - 1].id : -1,
            loadMore: messages.length === 10
        });
    }

    @UseGuards(AuthGuard)
    @Post("save-message")
    async saveMessage(@Body() body: SaveMessageAdminDto) {
        await this.supportChatsServiceAdmin.saveMessage(body);
    }

    @UseGuards(AuthGuard)
    @Get("messages/:id")
    async getMessagesByChatId(
        @Param("id", new ParseIntPipe()) chatId: number,
        @Query("take", new ParseIntPipe()) take: number,
        @Query("skip", new ParseIntPipe()) skip: number
    ) {
        return await this.supportChatsServiceAdmin.getMessagesByChatId(chatId, take, skip);
    }

    @UseGuards(AuthGuard)
    @Get("polling/:chatId")
    async loadMoreMessages(
        @Req() req: Request,
        @Param("chatId", new ParseIntPipe()) chatId: number,
        @Query("take", new ParseIntPipe()) take: number,
        @Query("idLastMessage", new ParseIntPipe()) idLastMessage: number
    ) {
        return await this.supportChatsServiceAdmin.getMessagesWhereIdGreater(chatId, take, idLastMessage);
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    async deleteChat(@Param("id", new ParseIntPipe()) id: number) {
        await this.supportChatsServiceAdmin.deleteChat(id);

        return;
    }
}
