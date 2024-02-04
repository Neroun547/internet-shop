import { Injectable } from "@nestjs/common";
import {ArticlesInterface} from "./interfaces/articles.interface";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Articles} from "./articles.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {UpdateArticleInterface} from "./interfaces/update-article.interface";

@Injectable()
export class ArticlesServiceDb {
    constructor(@InjectRepository(Articles) private repository: EntityRepository<Articles>) {}

    async saveArticle(article: ArticlesInterface) {
        await this.repository.nativeInsert(article);
    }
    async getArticles(count: number, skip: number) {
        return await this.repository.find({  }, { limit: count, offset: skip });
    }
    async getArticleByFilename(filename: string) {
        return await this.repository.findOne({ filename: filename });
    }
    async updateArticleByFilename(filename: string, data: UpdateArticleInterface) {
        await this.repository.nativeUpdate({ filename: filename }, data);
    }
    async deleteArticleByFilename(filename: string) {
        await this.repository.nativeDelete({ filename: filename });
    }
    async getArticlesByUserId(count: number, skip: number, userId: number) {
        return await this.repository.find({ user_id: userId }, { limit: count, offset: skip });
    }
    async getAllArticlesByUserId(userId: number) {
        return await this.repository.find({ user_id: userId });
    }
}
