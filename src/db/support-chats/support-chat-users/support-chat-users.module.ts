import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {SupportChatUsers} from "./support-chat-users.entity";
import {SupportChatUsersServiceDb} from "./support-chat-users.service";

@Module({
    imports: [MikroOrmModule.forFeature([SupportChatUsers])],
    providers: [SupportChatUsersServiceDb],
    exports: [SupportChatUsersServiceDb]
})
export class SupportChatUsersModuleDb {}
