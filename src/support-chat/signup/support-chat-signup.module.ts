import { Module } from "@nestjs/common";
import { SupportChatUsersModuleDb } from "../../../db/support-chats/support-chat-users/support-chat-users.module";
import {SupportChatSignupController} from "./support-chat-signup.controller";
import {SupportChatSignupService} from "./service/support-chat-signup.service";
import { TranslateModule } from "../../translate/translate.module";

@Module({
    imports: [SupportChatUsersModuleDb, TranslateModule],
    controllers: [SupportChatSignupController],
    providers: [SupportChatSignupService]
})
export class SupportChatSignupModule {}
