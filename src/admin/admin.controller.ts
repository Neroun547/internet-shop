import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "./auth/guards/auth.guard";

@Controller()
export class AdminController {
    constructor() {}

    @UseGuards(AuthGuard)
    @Get()
    getAdminPage(@Res() res: Response) {
        res.redirect("/admin/orders");
    }
}
