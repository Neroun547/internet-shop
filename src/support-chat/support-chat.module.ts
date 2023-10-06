import { Module } from "@nestjs/common";
import {SupportChatController} from "./support-chat.controller";
import {SupportChatService} from "./service/support-chat.service";
import { SupportChatUsersModuleDb } from "../../db/support-chats/support-chat-users/support-chat-users.module";
import { SupportChatMessagesModuleDb } from "../../db/support-chats/support-chat-messages/support-chat-messages.module";
import { SupportChatModuleDb } from "../../db/support-chats/support-chats.module";
import { TranslateModule } from "../translate/translate.module";

@Module({
    imports: [SupportChatUsersModuleDb, SupportChatMessagesModuleDb, SupportChatModuleDb, TranslateModule],
    controllers: [SupportChatController],
    providers: [SupportChatService]
})
export class SupportChatModule {}
