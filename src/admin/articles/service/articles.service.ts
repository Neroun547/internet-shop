import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {CommonService} from "../../../../common/common.service";
import * as Moment from "moment";
import {ArticlesServiceDb} from "../../../../db/articles/articles.service";
import {resolve} from "path";
import {readFile, writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import {SaveArticleDto} from "../dto/save-article.dto";

@Injectable()
export class ArticlesService {
    constructor(private commonService: CommonService, private articlesServiceDb: ArticlesServiceDb) {}

    async saveArticle(content: string, authors: string, name: string, theme: string, userId: number) {
        const localMoment = Moment();
        localMoment.locale("uk");

        const date = localMoment.format('MMMM Do YYYY, hh:mm a');
        const filename = this.commonService.generateRandomHash(20);

        await writeFile(resolve("views/articles/articles/" + filename + ".html"), content);

        const saveArticle = {
            filename: filename + ".html",
            created_at: date,
            updated_at: null,
            authors: authors,
            name: name,
            theme: theme,
            user_id: userId
        };

        await this.articlesServiceDb.saveArticle(saveArticle);
    }

    async getArticleContentByFilename(filename: string) {
        const article = await this.articlesServiceDb.getArticleByFilename(filename);
        const content = (await readFile(resolve("views/articles/articles/" + filename))).toString();

        return {
            content: content,
            article: article
        };
    }

    async updateArticleByFilename(filename: string, data: SaveArticleDto) {
        await this.articlesServiceDb.updateArticleByFilename(filename, {
            authors: data.authors,
            name: data.name,
            theme: data.theme
        });

        if(existsSync(resolve("views/articles/articles/" + filename))) {
            await writeFile(resolve("views/articles/articles/" + filename), data.content);
        } else {
            throw new NotFoundException();
        }
    }

    async deleteArticleByFilename(filename: string) {
        await this.articlesServiceDb.deleteArticleByFilename(filename);

        try {
            await unlink(resolve("views/articles/articles/" + filename + ".html"));
        } catch {
            throw new BadRequestException();
        }
    }
}
