import { Module } from "@nestjs/common";
import { SupportChatUsersModuleDb } from "../../../db/support-chats/support-chat-users/support-chat-users.module";
import {SupportChatAuthController} from "./support-chat-auth.controller";
import {SupportChatAuthService} from "./service/support-chat-auth.service";
import {JwtModule} from "@nestjs/jwt";
import { TranslateModule } from "../../translate/translate.module";
import { RubricsTypesModuleDb } from "../../../db/rubrics-types/rubrics-types.module";

@Module({
    imports: [
        TranslateModule,
        SupportChatUsersModuleDb,
        JwtModule.register({
            secret: "skjlvxfksnf234#23&",
            global: true,
            signOptions: { expiresIn: "6h" }
        }),
        RubricsTypesModuleDb
    ],
    controllers: [SupportChatAuthController],
    providers: [SupportChatAuthService]
})
export class SupportChatAuthModule {}
