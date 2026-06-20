import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {SupportChatMessages} from "./support-chat-messages.entity";
import {SupportChatMessagesServiceDb} from "./support-chat-messages.service";

@Module({
    imports: [MikroOrmModule.forFeature([SupportChatMessages])],
    providers: [SupportChatMessagesServiceDb],
    exports: [SupportChatMessagesServiceDb]
})
export class SupportChatMessagesModuleDb {}
