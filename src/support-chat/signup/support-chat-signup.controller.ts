import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {SupportChatSignupService} from "./service/support-chat-signup.service";
import {Response, Request} from "express";
import { TranslateService } from "../../translate/service/translate.service";
import { RubricsTypesServiceDb } from "../../../db/rubrics-types/rubrics-types.service";

@Controller()
export class SupportChatSignupController {
    constructor(
      private chatSignupService: SupportChatSignupService,
      private translateService: TranslateService,
      private rubricsTypesServiceDb: RubricsTypesServiceDb
    ) {}

    @Get()
    async signupChatPage(@Req() req: Request, @Res() res: Response, @Query("rubricId") rubricId) {
        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("support_chat_signup_page", req.cookies["iso_code_shop"]);

        if(rubricId) {
            res.render("support-chat/signup", {
                styles: ["/css/admin/auth/auth.css", "/css/chat/auth.css"],
                scripts: ["/js/chat/signup/signup.js"],
                activeLanguage: req.cookies["iso_code_shop"],
                filtersMenuItems: await this.rubricsTypesServiceDb.getTypesByRubricId(Number(rubricId)),
                ...translate,
                rubric_id: rubricId
            });
        } else {
            res.render("support-chat/signup", {
                styles: ["/css/admin/auth/auth.css", "/css/chat/auth.css"],
                scripts: ["/js/chat/signup/signup.js"],
                activeLanguage: req.cookies["iso_code_shop"],
                ...translate
            });
        }
    }

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        await this.chatSignupService.createUser(body);

        return { message: "Аккаунт створено успішно" };
    }
}
