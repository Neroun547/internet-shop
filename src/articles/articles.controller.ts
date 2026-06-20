import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from "@nestjs/common";
import {ArticlesService} from "./service/articles.service";
import { readFile } from "fs/promises";
import { resolve } from "path";

@Controller()
export class ArticlesController {
    constructor(
      private articlesService: ArticlesService,
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
