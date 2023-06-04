import { Module } from "@nestjs/common";
import { SupportChatUsersModuleDb } from "../../../db/support-chats/support-chat-users/support-chat-users.module";
import {SupportChatAuthController} from "./support-chat-auth.controller";
import {SupportChatAuthService} from "./service/support-chat-auth.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        SupportChatUsersModuleDb,
        JwtModule.register({
            secret: "skjlvxfksnf234#23&",
            global: true,
            signOptions: { expiresIn: "6h" }
        })
    ],
    controllers: [SupportChatAuthController],
    providers: [SupportChatAuthService]
})
export class SupportChatAuthModule {}
