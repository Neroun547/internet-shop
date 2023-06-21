import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { Response } from "express";
import {AuthGuard} from "../auth/guards/auth.guard";
import {SaveArticleDto} from "./dto/save-article.dto";
import {ArticlesService} from "./service/articles.service";
import {FileInterceptor} from "@nestjs/platform-express";
import { Request } from "express";

@Controller()
export class ArticlesController {
    constructor(private articlesService: ArticlesService) {}

    @UseGuards(AuthGuard)
    @Get()
    async getArticlesPage(@Res() res: Response) {
        const articles = await this.articlesService.getArticles(10, 0);

        res.render("admin/articles/articles", {
            admin: true,
            styles: ["/css/admin/articles/articles.css"],
            scripts: ["/js/admin/articles/articles.js"],
            articles: articles,
            loadMore: articles.length === 10
        });
    }

    @UseGuards(AuthGuard)
    @Get("upload-article")
    getUploadArticlePage(@Res() res: Response) {
        res.render("admin/articles/upload-article", {
            admin: true,
            scripts: ["/js/admin/articles/upload-article.js"],
            headScripts: ["https://cdn.tiny.cloud/1/fqqboid3jj5dviefd7qko96da2nnz3run5y6af5t891srayh/tinymce/6/tinymce.min.js"],
            styles: ["/css/admin/articles/upload-article.css"]
        });
    }

    @UseGuards(AuthGuard)
    @Post()
    async saveArticle(@Body() body: SaveArticleDto, @Res() res: Response) {
        await this.articlesService.saveArticle(body.content, body.authors, body.name, body.theme);

        res.redirect("/admin/articles");
    }

    @UseGuards(AuthGuard)
    @Get("edit/:filename")
    async getEditArticlePage(@Param("filename") filename: string, @Res() res: Response) {
        const { content, article } = await this.articlesService.getArticleContentByFilename(filename);

        res.render("admin/articles/edit-article", {
            content: content,
            authors: article.authors,
            name: article.name,
            filename: article.filename,
            theme: article.theme,
            admin: true,
            styles: ["/css/admin/articles/upload-article.css"],
            headScripts: ["https://cdn.tiny.cloud/1/fqqboid3jj5dviefd7qko96da2nnz3run5y6af5t891srayh/tinymce/6/tinymce.min.js"],
            scripts: ["/js/admin/articles/edit-article.js"]
        });
    }

    @UseGuards(AuthGuard)
    @Patch("edit/:filename")
    async editArticle(@Param("filename") filename: string, @Body() body: SaveArticleDto) {
        await this.articlesService.updateArticleByFilename(filename, body);

        return;
    }

    @UseGuards(AuthGuard)
    @Delete(":filename")
    async deleteArticle(@Param("filename") filename: string) {
        await this.articlesService.deleteArticleByFilename(filename);

        return;
    }
}