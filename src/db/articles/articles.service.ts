import { Injectable } from "@nestjs/common";
import {ArticlesInterface} from "./interfaces/articles.interface";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Articles} from "./articles.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {UpdateArticleInterface} from "./interfaces/update-article.interface";
import { ArticlesMapper } from "./articles.mapper";

@Injectable()
export class ArticlesServiceDb {
    constructor(@InjectRepository(Articles) private repository: EntityRepository<Articles>) {}

    async saveArticle(article: ArticlesInterface): Promise<void> {
       const newModel = ArticlesMapper.toPersist(article);

       await this.repository.getEntityManager().persist(newModel).flush();
    }
    async getArticles(count: number, skip: number): Promise<ArticlesInterface[]> {
        const data = await this.repository.find({  }, { limit: count, offset: skip, orderBy: { created_at: "ASC" } });

        return data.map(item => ArticlesMapper.toDomain(item));        
    }
    async getArticleByFilename(filename: string): Promise<ArticlesInterface | null> {
        const data = await this.repository.findOne({ filename: filename });

        if(!data) {
            return null;
        }
        return ArticlesMapper.toDomain(data);
    }
    async updateArticleByFilename(filename: string, data: UpdateArticleInterface): Promise<void> {
        await this.repository.nativeUpdate({ filename: filename }, data);
    }
    async deleteArticleByFilename(filename: string): Promise<void> {
        await this.repository.nativeDelete({ filename: filename });
    }
    async getArticlesByUserId(count: number, skip: number, userId: number): Promise<ArticlesInterface[]> {
        const data = await this.repository.find({ user_id: userId }, { limit: count, offset: skip });

        return data.map(item => ArticlesMapper.toDomain(item));
    }
    async getAllArticlesByUserId(userId: number): Promise<ArticlesInterface[]> {
        const data = await this.repository.find({ user_id: userId });

        return data.map(item => ArticlesMapper.toDomain(item));
    }
}
