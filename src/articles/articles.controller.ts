import {Controller, Get, Res} from "@nestjs/common";
import { Response } from "express";

@Controller()
export class ArticlesController {
    @Get()
    getArticlesPage(@Res() res: Response) {
        res.render("articles/articles");
    }
}
