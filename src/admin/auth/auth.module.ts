import { Module } from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {AuthService} from "./service/auth.service";
import {UsersModuleDb} from "../../../db/users/users.module";

@Module({
    imports: [
        UsersModuleDb,
        JwtModule.register({
            global: true,
            secret: "s@bf172hj1234dsb#",
            signOptions: { expiresIn: "6h" },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
