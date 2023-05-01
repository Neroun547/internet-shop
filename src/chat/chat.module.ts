import { Module } from "@nestjs/common";
import {ChatController} from "./chat.controller";
import {ChatService} from "./service/chat.service";
import {ChatUsersModuleDb} from "../../db/chat-users/chat-users.module";

@Module({
    imports: [ChatUsersModuleDb],
    controllers: [ChatController],
    providers: [ChatService]
})
export class ChatModule {}
