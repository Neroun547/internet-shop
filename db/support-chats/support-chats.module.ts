import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {SupportChats} from "./support-chats.entity";
import {SupportChatServiceDb} from "./support-chats.service";

@Module({
    imports: [MikroOrmModule.forFeature([SupportChats])],
    providers: [SupportChatServiceDb],
    exports: [SupportChatServiceDb]
})
export class SupportChatModuleDb {}
