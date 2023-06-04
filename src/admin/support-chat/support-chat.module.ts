import { Module } from "@nestjs/common";
import {SupportChatModuleDb} from "../../../db/support-chats/support-chats.module";
import {SupportChatControllerAdmin} from "./support-chat.controller";
import {SupportChatServiceAdmin} from "./service/support-chat.service";
import {
    SupportChatMessagesModuleDb
} from "../../../db/support-chats/support-chat-messages/support-chat-messages.module";

@Module({
    imports: [SupportChatModuleDb, SupportChatMessagesModuleDb],
    controllers: [SupportChatControllerAdmin],
    providers: [SupportChatServiceAdmin]
})
export class SupportChatModuleAdmin {}
