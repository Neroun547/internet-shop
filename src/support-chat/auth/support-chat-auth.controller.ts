import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import {CreateUserDto} from "../signup/dto/create-user.dto";
import {SupportChatAuthService} from "./service/support-chat-auth.service";
import { Response, Request } from "express";
import { TranslateService } from "../../translate/service/translate.service";
import { RubricsTypesServiceDb } from "../../../db/rubrics-types/rubrics-types.service";

@Controller()
export class SupportChatAuthController {
    constructor(
        private chatAuthService: SupportChatAuthService,
        private translateService: TranslateService,
        private rubricsTypesServiceDb: RubricsTypesServiceDb
    ) {}

    @Get()
    async authChatPage(@Req() req: Request, @Res() res: Response, @Query("rubricId") rubricId) {
        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("support_chat_auth_page", req.cookies["iso_code_shop"]);

        if(rubricId) {
            res.render("support-chat/auth", {
                styles: ["/css/admin/auth/auth.css", "/css/chat/auth.css"],
                scripts: ["/js/chat/auth/auth.js"],
                activeLanguage: req.cookies["iso_code_shop"],
                ...translate,
                filtersMenuItems: await this.rubricsTypesServiceDb.getTypesByRubricId(Number(rubricId)),
                rubric_id: rubricId
            });
        } else {
            res.render("support-chat/auth", {
                styles: ["/css/admin/auth/auth.css", "/css/chat/auth.css"],
                scripts: ["/js/chat/auth/auth.js"],
                activeLanguage: req.cookies["iso_code_shop"],
                ...translate
            })
        }
    }

    @Post()
    async auth(@Body() body: CreateUserDto, @Res() res: Response) {
        const token: string = await this.chatAuthService.auth(body);

        res.cookie(process.env.AUTH_CHAT_COOKIE_NAME, token);
        res.send({ message: "Аунтифікація успішна" });
    }
}
