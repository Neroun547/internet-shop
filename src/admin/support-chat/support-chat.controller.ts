import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    Res,
    UseFilters,
    UseGuards
} from "@nestjs/common";
import { Response, Request } from "express";
import {SupportChatServiceAdmin} from "./service/support-chat.service";
import {AuthGuard} from "../auth/guards/auth.guard";
import {SaveMessageAdminDto} from "./dto/save-message-admin.dto";
import {HttpExceptionFilter} from "../../../error-filters/error-filter-admin";

@Controller()
@UseFilters(HttpExceptionFilter)
export class SupportChatControllerAdmin {
    constructor(private supportChatsServiceAdmin: SupportChatServiceAdmin) {
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
