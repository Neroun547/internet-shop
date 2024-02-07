import { Controller, Get, Param, ParseIntPipe, Query, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import {ArticlesService} from "./service/articles.service";
import { TranslateService } from "../translate/service/translate.service";
import { RubricsTypesServiceDb } from "../../db/rubrics-types/rubrics-types.service";

@Controller()
export class ArticlesController {
    constructor(
      private articlesService: ArticlesService,
      private translateService: TranslateService,
      private rubricsTypesServiceDb: RubricsTypesServiceDb
    ) {}

    @Get()
    async getArticlesPage(@Req() req: Request, @Res() res: Response, @Query("rubricId") rubricId) {
        const articles = await this.articlesService.getArticles(10, 0);
        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("articles_page", req.cookies["iso_code_shop"]);
        let rubricsTypes;

        if(!isNaN(Number(rubricId))) {
            rubricsTypes = await this.rubricsTypesServiceDb.getTypesByRubricId(rubricId);
        } else {
            rubricsTypes = [];
        }

        if(articles.length) {
            res.render("articles/articles", {
                articles: articles,
                styles: ["/css/articles/articles.css"],
                scripts: ["/js/articles/articles.js"],
                loadMore: articles.length === 10,
                activeLanguage: req.cookies["iso_code_shop"],
                ...translate,
                filtersMenuItems: rubricsTypes.length ? rubricsTypes : false,
                rubric_id: rubricId
            });
        } else {
            res.render("articles/articles", {
                articles: false,
                styles: ["/css/articles/articles.css"],
                activeLanguage: req.cookies["iso_code_shop"],
                ...translate
            });
        }
    }

    @Get("articles")
    async getArticles(@Query("count", new ParseIntPipe()) count: number, @Query("skip", new ParseIntPipe()) skip: number) {
        return await this.articlesService.getArticles(count, skip);
    }

    @Get(":article")
    async getArticleByFileName(@Param("article") article, @Req() req: Request, @Res() res: Response) {
        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("article_page", req.cookies["iso_code_shop"]);

        res.render("articles/articles/" + article, {
            activeLanguage: req.cookies["iso_code_shop"],
            ...translate
        });
    }
}
