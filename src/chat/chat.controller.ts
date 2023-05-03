import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import { Response } from "express";
import {ChatService} from "./service/chat.service";
import {CreateUserDto} from "./dto/create-user.dto";

@Controller()
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get("/auth")
    authChatPage(@Res() res: Response) {
        res.render("chat/auth", {
            styles: ["/css/admin/auth/auth.css", "/css/chat/auth.css"],
            scripts: ["/js/chat/auth/auth.js"]
        });
    }

    @Get("/signup")
    signupChatPage(@Res() res: Response) {
        res.render("chat/signup", {
            styles: ["/css/admin/auth/auth.css", "/css/chat/auth.css"],
            scripts: ["/js/chat/signup/signup.js"]
        });
    }

    @Post("/signup")
    async createUser(@Body() body: CreateUserDto) {
        await this.chatService.createUser(body);

        return { message: "Аккаунт створено успішно" };
    }

    @Post("auth")
    async auth() {

    }
}
