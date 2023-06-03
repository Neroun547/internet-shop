import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {SupportChatSignupService} from "./service/support-chat-signup.service";
import {Response} from "express";

@Controller()
export class SupportChatSignupController {
    constructor(private chatSignupService: SupportChatSignupService) {}

    @Get()
    signupChatPage(@Res() res: Response) {
        res.render("support-chat/signup", {
            styles: ["/css/admin/auth/auth.css", "/css/chat/auth.css"],
            scripts: ["/js/chat/signup/signup.js"]
        });
    }

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        await this.chatSignupService.createUser(body);

        return { message: "Аккаунт створено успішно" };
    }
}
