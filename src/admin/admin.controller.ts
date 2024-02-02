import { Controller, Get, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { Response, Request } from "express";
import { AuthGuard } from "./auth/guards/auth.guard";
import {HttpExceptionFilter} from "../../error-filters/error-filter-admin";

@Controller()
@UseFilters(HttpExceptionFilter)
export class AdminController {
    constructor() {}

    @UseGuards(AuthGuard)
    @Get()
    getAdminPage(@Req() req: Request, @Res() res: Response) {
        res.render("admin/root", {
            admin: true,
            styles: ["/css/admin/main.css"],
            partner: req["user"].role !== "admin"
        });
    }
}
