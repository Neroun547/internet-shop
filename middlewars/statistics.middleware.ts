import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import {StatisticsServiceDb} from "../db/statistics/statistics.service";
import {CommonService} from "../common/common.service";
const Moment = require("moment");

@Injectable()
export class StatisticsMiddleware implements NestMiddleware {
    constructor(
        private statisticsServiceDb: StatisticsServiceDb,
        private commonService: CommonService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {

        if(!req.originalUrl.includes("admin") && req.socket.remoteAddress) {
            const date = Moment().format("YYYY-MM-DD");
            const userInDb = await this.statisticsServiceDb.getDataByUserToday(req.socket.remoteAddress, date);

            if (!userInDb) {

                try {
                    const getDataAboutIp: any = await this.commonService.promisifyHttpsRequest(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.API_LOCATION_BY_IP_TOKEN}&ip=${req.socket.remoteAddress.replace("::ffff:", "")}`);
                    const data = JSON.parse(getDataAboutIp);

                    await this.statisticsServiceDb.saveData(req.socket.remoteAddress, date, data.country_code2);
                } catch(e) {
                    await this.statisticsServiceDb.saveData(req.socket.remoteAddress, date, null);
                }
            }
            next();
        } else {
            next();
        }
    }
}
