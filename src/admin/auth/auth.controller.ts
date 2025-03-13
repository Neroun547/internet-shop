import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import { Response } from "express";
import {AuthService} from "./service/auth.service";
import {AuthDto} from "./dto/auth.dto";

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    async auth(@Body() body: AuthDto) {
        const data = await this.authService.auth(body);

        return { token: data.token, role: data.userRole };
    }

    @Get("exit")
    exit(@Res() res: Response) {
        res.cookie(process.env.AUTH_TOKEN_COOKIE_NAME, "");
        res.redirect("/admin/auth");
    }
}
