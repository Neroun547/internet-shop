import {Controller, Get, Param, ParseIntPipe, Query, Res} from "@nestjs/common";
import { Response } from "express";
import {ArticlesService} from "./service/articles.service";

@Controller()
export class ArticlesController {
    constructor(private articlesService: ArticlesService) {}

    @Get()
    async getArticlesPage(@Res() res: Response) {
        const articles = await this.articlesService.getArticles(10, 0);

        if(articles.length) {
            res.render("articles/articles", {
                articles: articles,
                styles: ["/css/articles/articles.css"],
                scripts: ["/js/articles/articles.js"],
                loadMore: articles.length === 10
            });
        } else {
            res.render("articles/articles", {
                articles: false,
                styles: ["/css/articles/articles.css"]
            });
        }
    }

    @Get("articles")
    async getArticles(@Query("count", new ParseIntPipe()) count: number, @Query("skip", new ParseIntPipe()) skip: number) {
        return await this.articlesService.getArticles(count, skip);
    }

    @Get(":article")
    async getArticleByFileName(@Param("article") article, @Res() res: Response) {
        res.render("articles/articles/" + article);
    }
}
