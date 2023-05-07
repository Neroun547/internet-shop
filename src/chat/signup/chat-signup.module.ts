import { Module } from "@nestjs/common";
import {ChatUsersModuleDb} from "../../../db/chat-users/chat-users.module";
import {ChatSignupController} from "./chat-signup.controller";
import {ChatSignupService} from "./service/chat-signup.service";

@Module({
    imports: [ChatUsersModuleDb],
    controllers: [ChatSignupController],
    providers: [ChatSignupService]
})
export class ChatSignupModule {}
