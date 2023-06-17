import {Body, Controller, Get, Post, Res, UseGuards} from "@nestjs/common";
import { Response } from "express";
import {AuthGuard} from "../auth/guards/auth.guard";

@Controller()
export class ArticlesController {

    @UseGuards(AuthGuard)
    @Get()
    getArticlesPage(@Res() res: Response) {
        res.render("admin/articles/articles", {
            admin: true,
            styles: ["/css/admin/articles/articles.css"]
        });
    }

    @UseGuards(AuthGuard)
    @Get("upload-article")
    getUploadArticlePage(@Res() res: Response) {
        res.render("admin/articles/upload-article", {
            admin: true,
            scripts: ["https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js", "/js/admin/articles/upload-article.js"],
            styles: ["/css/admin/articles/upload-article.css"]
        });
    }

    @UseGuards(AuthGuard)
    @Post()
    async saveArticle(@Body() body) {
        console.log(body);

        return;
    }
}
