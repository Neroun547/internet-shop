import {Body, Controller, Get, Post, Res, UseFilters} from "@nestjs/common";
import {CreateUserDto} from "../signup/dto/create-user.dto";
import {SupportChatAuthService} from "./service/support-chat-auth.service";
import { Response } from "express";

@Controller()

export class SupportChatAuthController {
    constructor(
        private chatAuthService: SupportChatAuthService
    ) {}

    @Get()
    authChatPage(@Res() res: Response) {
        res.render("support-chat/auth", {
            styles: ["/css/admin/auth/auth.css", "/css/chat/auth.css"],
            scripts: ["/js/chat/auth/auth.js"]
        });
    }

    @Post()
    async auth(@Body() body: CreateUserDto, @Res() res: Response) {
        const token: string = await this.chatAuthService.auth(body);

        res.cookie(process.env.AUTH_CHAT_COOKIE_NAME, token);
        res.send({ message: "Аунтифікація успішна" });
    }
}
