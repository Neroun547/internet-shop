import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import {ArticlesService} from "./service/articles.service";
import { TranslateService } from "../translate/service/translate.service";
import { CommonService } from "../../common/common.service";
import { readFile } from "fs/promises";
import { resolve } from "path";

@Controller()
export class ArticlesController {
    constructor(
      private articlesService: ArticlesService,
      private translateService: TranslateService,
      private commonService: CommonService
    ) {}

    @Get()
    async getArticles(@Query("take", new ParseIntPipe()) take: number, @Query("skip", new ParseIntPipe()) skip: number) {
        return await this.articlesService.getArticles(take, skip);
    }

    @Get(":article")
    async getArticleByFileName(@Param("article") article: string) {
        try {
            const data = await readFile(resolve("views/articles/articles/" + article), "utf8");

            return data.toString();
        } catch(e) {
            console.log(e)
            throw new NotFoundException();
        }
    }
}
