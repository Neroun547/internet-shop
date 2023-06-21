import {Controller, Get, Res, UseFilters, UseGuards} from "@nestjs/common";
import { Response } from "express";
import {AuthGuard} from "./auth/guards/auth.guard";
import {HttpExceptionFilter} from "../../error-filters/error-filter-admin";

@Controller()
@UseFilters(HttpExceptionFilter)
export class AdminController {

    @UseGuards(AuthGuard)
    @Get()
    getAdminPage(@Res() res: Response) {
        res.render("admin/root", {
            admin: true,
            styles: ["/css/admin/main.css"]
        });
    }
}
