import { Module } from "@nestjs/common";
import {ArticlesController} from "./articles.controller";
import {ArticlesService} from "./service/articles.service";
import {ArticlesModuleDb} from "../../db/articles/articles.module";

@Module({
    imports: [ArticlesModuleDb],
    controllers: [ArticlesController],
    providers: [ArticlesService]
})
export class ArticlesModule {}
