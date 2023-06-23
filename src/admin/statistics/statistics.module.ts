import { Module } from "@nestjs/common";
import {StatisticsController} from "./statistics.controller";
import {StatisticsService} from "./service/statistics.service";
import {StatisticsModuleDb} from "../../../db/statistics/statistics.module";

@Module({
    imports: [StatisticsModuleDb],
    controllers: [StatisticsController],
    providers: [StatisticsService]
})
export class StatisticsModule {}
