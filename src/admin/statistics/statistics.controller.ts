import {Controller, Get, Param, ParseIntPipe, Query, Res, UseFilters, UseGuards} from "@nestjs/common";
import {StatisticsService} from "./service/statistics.service";
import { Response } from "express";
import {AuthGuard} from "../auth/guards/auth.guard";
import {HttpExceptionFilter} from "../../../error-filters/error-filter-admin";

@Controller()
@UseFilters(HttpExceptionFilter)
export class StatisticsController {
    constructor(private statisticsService: StatisticsService) {}

    @UseGuards(AuthGuard)
    @Get()
    getStatisticsPage(@Res() res: Response) {
        res.render("admin/statistics/statistics", {
            admin: true,
            scripts: ["/js/admin/statistics/statistics.js"],
            styles: ["/css/admin/statistics/statistics.css"]
        });
    }

    @UseGuards(AuthGuard)
    @Get("data")
    async getStatisticsData(@Query("date_from") date_from, @Query("date_to") date_to: string) {
        return await this.statisticsService.getDataByDateFromAndDateTo(date_from, date_to);
    }

    @UseGuards(AuthGuard)
    @Get("api-token")
    async getApiToken() {
        return { token: process.env.API_LOCATION_BY_IP_TOKEN };
    }

}
