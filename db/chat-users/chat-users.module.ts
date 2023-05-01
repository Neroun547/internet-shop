import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {ChatUsers} from "./chat-users.entity";
import {ChatUsersServiceDb} from "./chat-users.service";

@Module({
    imports: [MikroOrmModule.forFeature([ChatUsers])],
    providers: [ChatUsersServiceDb],
    exports: [ChatUsersServiceDb]
})
export class ChatUsersModuleDb {}
