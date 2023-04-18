import {Controller, Get, Res, UseGuards} from "@nestjs/common";
import { Response } from "express";
import {AuthGuard} from "./auth/guards/auth.guard";

@Controller()
export class AdminController {

    @UseGuards(AuthGuard)
    @Get()
    getAdminPage(@Res() res: Response) {
        res.render("admin/root", {
            admin: true,
            auth: true,
            styles: ["/css/admin/main.css"]
        });
    }
}
