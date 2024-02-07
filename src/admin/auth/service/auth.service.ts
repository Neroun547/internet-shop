import { Injectable, UnauthorizedException} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {UsersServiceDb} from "../../../../db/users/users.service";
import * as argon2 from "argon2";
import { AuthInterface } from "../interfaces/auth.interface";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersServiceDb: UsersServiceDb
    ) {}

    async auth(user: AuthInterface) {
        const userInDb = await this.usersServiceDb.getUserByName(user.name);

        if(!userInDb) {
            throw new UnauthorizedException({ message: "Хибне ім'я або пароль" });
        }
        const checkPassword = await argon2.verify(userInDb.password, user.password);

        if(checkPassword) {
            return this.jwtService.sign(JSON.parse(JSON.stringify(userInDb)), { secret: process.env.SECRET_JWT});
        }
        throw new UnauthorizedException({ message: "Хибне ім'я або пароль" });
    }
}
