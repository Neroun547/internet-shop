import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import { Request } from "express";
import {AuthGuard} from "../auth/guards/auth.guard";
import {SaveArticleDto} from "./dto/save-article.dto";
import {ArticlesService} from "./service/articles.service";

@Controller()
export class ArticlesController {
    constructor(private articlesService: ArticlesService) {}

    @UseGuards(AuthGuard)
    @Post()
    async saveArticle(@Req() req: Request, @Body() body: SaveArticleDto) {
        await this.articlesService.saveArticle(body.content, body.authors, body.name, body.theme, req["user"].id);

        return;
    }

    @UseGuards(AuthGuard)
    @Get(":filename")
    async getEditArticlePage(@Param("filename") filename: string) {
        const { content, article } = await this.articlesService.getArticleContentByFilename(filename);

        return {
            content: content,
            authors: article.authors,
            name: article.name,
            filename: article.filename,
            theme: article.theme,
        };
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
