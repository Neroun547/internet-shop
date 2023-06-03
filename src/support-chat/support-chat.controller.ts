import {Body, Controller, Get, ParseIntPipe, Post, Query, Req, Res, UseFilters, UseGuards} from "@nestjs/common";
import { Response, Request } from "express";
import {SupportChatService} from "./service/support-chat.service";
import {SupportChatAuthGuard} from "./auth/guards/support-chat-auth.guard";
import {HttpExceptionFilter} from "../../error-filters/error-filter-client-chat";
import {SaveMessageDto} from "./dto/save-message.dto";

@Controller()
@UseFilters(HttpExceptionFilter)
export class SupportChatController {
    constructor(private chatService: SupportChatService) {}

    @Get()
    @UseGuards(SupportChatAuthGuard)
    async chatPage(@Req() req: Request, @Res() res: Response) {
        const messages = await this.chatService.getMessages(req["user"].id, 10, 0);

        res.render("support-chat/chat", {
            styles: ["/css/chat/chat.css"],
            scripts: ["/js/chat/chat.js"],
            messages: messages,
            idLastMessage: messages[messages.length - 1] ? messages[messages.length - 1].id : -1,
            loadMore: messages.length === 10
        });
    }

    @Post("save-message")
    @UseGuards(SupportChatAuthGuard)
    async saveMessage(@Req() req: Request, @Body() body: SaveMessageDto) {
        await this.chatService.saveMessage(body.message, req["user"].id);

        return;
    }

    @Get("messages")
    @UseGuards(SupportChatAuthGuard)
    async getMessages(
        @Req() req: Request,
        @Query("take", new ParseIntPipe()) take: number,
        @Query("skip", new ParseIntPipe()) skip: number
    ) {
        return await this.chatService.getMessages(req["user"].id, take, skip);
    }

    @Get("polling")
    @UseGuards(SupportChatAuthGuard)
    async loadMoreMessages(
        @Req() req: Request,
        @Query("take", new ParseIntPipe()) take: number,
        @Query("idLastMessage", new ParseIntPipe()) idLastMessage: number
    ) {
        return await this.chatService.getMessagesWhereIdGreater(req["user"].id, take, idLastMessage);
    }
}
