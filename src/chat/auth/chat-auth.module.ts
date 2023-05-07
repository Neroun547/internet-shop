import { Module } from "@nestjs/common";
import {ChatUsersModuleDb} from "../../../db/chat-users/chat-users.module";
import {ChatAuthController} from "./chat-auth.controller";
import {ChatAuthService} from "./service/chat-auth.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        ChatUsersModuleDb,
        JwtModule.register({
            secret: "skjlvxfksnf234#23&",
            global: true,
            signOptions: { expiresIn: "6h" }
        })
    ],
    controllers: [ChatAuthController],
    providers: [ChatAuthService]
})
export class ChatAuthModule {}
