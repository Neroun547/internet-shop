import { Module } from "@nestjs/common";
import {SupportChatController} from "./support-chat.controller";
import {SupportChatService} from "./service/support-chat.service";
import { SupportChatUsersModuleDb } from "../../db/support-chats/support-chat-users/support-chat-users.module";
import { SupportChatMessagesModuleDb } from "../../db/support-chats/support-chat-messages/support-chat-messages.module";
import { SupportChatModuleDb } from "../../db/support-chats/support-chats.module";

@Module({
    imports: [SupportChatUsersModuleDb, SupportChatMessagesModuleDb, SupportChatModuleDb],
    controllers: [SupportChatController],
    providers: [SupportChatService]
})
export class SupportChatModule {}
