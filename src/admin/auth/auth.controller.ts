import {Body, Controller, Get, Post, Req, Res} from "@nestjs/common";
import { Response } from "express";
import {AuthService} from "./service/auth.service";

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Get()
    getAuthPage(@Res() res: Response) {
        res.render("admin/auth/auth", {
            admin: true,
            styles: ["/css/admin/auth/auth.css"]
        });
    }

    @Post()
    async auth(@Body() body, @Res() res: Response) {
        const token = await this.authService.auth(body);

        res.cookie(process.env.AUTH_TOKEN_COOKIE_NAME, token);
        res.redirect("/admin");
    }

    @Get("exit")
    exit(@Res() res: Response) {
        res.cookie(process.env.AUTH_TOKEN_COOKIE_NAME, "");
        res.redirect("/admin/auth");
    }
}
