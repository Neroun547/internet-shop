import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import {StatisticsService} from "./service/statistics.service";
import {AuthGuard} from "../auth/guards/auth.guard";

@Controller()
export class StatisticsController {
    constructor(private statisticsService: StatisticsService) {}

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
