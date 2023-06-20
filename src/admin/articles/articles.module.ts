import { Module } from "@nestjs/common";
import {ArticlesController} from "./articles.controller";
import {ArticlesService} from "./service/articles.service";
import {CommonModule} from "../../../common/common.module";
import {ArticlesModuleDb} from "../../../db/articles/articles.module";

@Module({
    imports: [CommonModule, ArticlesModuleDb],
    controllers: [ArticlesController],
    providers: [ArticlesService]
})
export class ArticlesModuleAdmin {}
