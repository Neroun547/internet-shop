import { Injectable } from "@nestjs/common";
import {ArticlesServiceDb} from "../../../db/articles/articles.service";

@Injectable()
export class ArticlesService {
    constructor(private articlesServiceDb: ArticlesServiceDb) {}

    async getArticles(count: number, skip: number) {
        return await this.articlesServiceDb.getArticles(count, skip);
    }
}
