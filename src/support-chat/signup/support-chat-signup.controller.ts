import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {SupportChatSignupService} from "./service/support-chat-signup.service";
import {Response, Request} from "express";
import { TranslateService } from "../../translate/service/translate.service";

@Controller()
export class SupportChatSignupController {
    constructor(
      private chatSignupService: SupportChatSignupService,
      private translateService: TranslateService
    ) {}

    @Get()
    async signupChatPage(@Req() req: Request, @Res() res: Response) {
        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("support_chat_signup_page", req.cookies["iso_code_shop"]);

        res.render("support-chat/signup", {
            styles: ["/css/admin/auth/auth.css", "/css/chat/auth.css"],
            scripts: ["/js/chat/signup/signup.js"],
            activeLanguage: req.cookies["iso_code_shop"],
            ...translate
        });
    }

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        await this.chatSignupService.createUser(body);

        return { message: "Аккаунт створено успішно" };
    }
}
