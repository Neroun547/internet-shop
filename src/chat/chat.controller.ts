import { Controller, Get, Res, UseFilters, UseGuards } from "@nestjs/common";
import { Response } from "express";
import {ChatService} from "./service/chat.service";
import {ChatAuthGuard} from "./auth/guards/chat-auth.guard";
import {HttpExceptionFilter} from "../../error-filters/error-filter-client-chat";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get()
    @UseGuards(ChatAuthGuard)
    chatPage(@Res() res: Response) {
        res.render("chat/chat");
    }
}
