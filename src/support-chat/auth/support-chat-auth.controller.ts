import { Body, Controller, Get, Post, Req, Res, UseFilters } from "@nestjs/common";
import {CreateUserDto} from "../signup/dto/create-user.dto";
import {SupportChatAuthService} from "./service/support-chat-auth.service";
import { Response, Request } from "express";
import { TranslateService } from "../../translate/service/translate.service";

@Controller()
export class SupportChatAuthController {
    constructor(
        private chatAuthService: SupportChatAuthService,
        private translateService: TranslateService
    ) {}

    @Get()
    async authChatPage(@Req() req: Request, @Res() res: Response) {
        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("support_chat_auth_page", req.cookies["iso_code_shop"]);

        res.render("support-chat/auth", {
            styles: ["/css/admin/auth/auth.css", "/css/chat/auth.css"],
            scripts: ["/js/chat/auth/auth.js"],
            activeLanguage: req.cookies["iso_code_shop"],
            ...translate
        });
    }

    @Post()
    async auth(@Body() body: CreateUserDto, @Res() res: Response) {
        const token: string = await this.chatAuthService.auth(body);

        res.cookie(process.env.AUTH_CHAT_COOKIE_NAME, token);
        res.send({ message: "Аунтифікація успішна" });
    }
}
