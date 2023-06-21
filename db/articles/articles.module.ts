import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Articles} from "./articles.entity";
import {ArticlesServiceDb} from "./articles.service";

@Module({
    imports: [MikroOrmModule.forFeature([Articles])],
    providers: [ArticlesServiceDb],
    exports: [ArticlesServiceDb]
})
export class ArticlesModuleDb {}
