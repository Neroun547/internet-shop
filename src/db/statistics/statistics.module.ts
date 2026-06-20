import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Statistics} from "./statistics.entity";
import {StatisticsServiceDb} from "./statistics.service";

@Module({
    imports: [MikroOrmModule.forFeature([Statistics])],
    providers: [StatisticsServiceDb],
    exports: [StatisticsServiceDb]
})
export class StatisticsModuleDb { }
