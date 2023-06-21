import { Module } from "@nestjs/common";
import {ArticlesController} from "./articles.controller";
import {ArticlesService} from "./service/articles.service";
import {CommonModule} from "../../../common/common.module";
import {ArticlesModuleDb} from "../../../db/articles/articles.module";
import {MulterModule} from "@nestjs/platform-express";

@Module({
    imports: [
        CommonModule,
        ArticlesModuleDb,
        MulterModule.register({
            dest: 'static/images',
        })
    ],
    controllers: [ArticlesController],
    providers: [ArticlesService]
})
export class ArticlesModuleAdmin {}
