import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import { Response } from "express";
import {AuthService} from "./service/auth.service";
import {AuthDto} from "./dto/auth.dto";

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Get()
    getAuthPage(@Res() res: Response) {
        res.render("admin/auth/auth", {
            admin: true,
            auth: false,
            styles: ["/css/admin/auth/auth.css"],
            scripts: ["/js/admin/auth/auth.js"]
        });
    }

    @Post()
    async auth(@Body() body: AuthDto, @Res() res: Response) {
        const token = await this.authService.auth(body);

        res.cookie(process.env.AUTH_TOKEN_COOKIE_NAME, token);
        res.send({ message: "Auth success" });
    }

    @Get("exit")
    exit(@Res() res: Response) {
        res.cookie(process.env.AUTH_TOKEN_COOKIE_NAME, "");
        res.redirect("/admin/auth");
    }
}
