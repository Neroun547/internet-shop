import { Module } from "@nestjs/common";
import {ArticlesController} from "./articles.controller";
import {ArticlesService} from "./service/articles.service";
import {ArticlesModuleDb} from "../../db/articles/articles.module";
import { TranslateModule } from "../translate/translate.module";
import { RubricsTypesModuleDb } from "../../db/rubrics-types/rubrics-types.module";

@Module({
    imports: [ArticlesModuleDb, TranslateModule, RubricsTypesModuleDb],
    controllers: [ArticlesController],
    providers: [ArticlesService]
})
export class ArticlesModule {}
