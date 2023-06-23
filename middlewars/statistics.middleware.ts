import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import {StatisticsServiceDb} from "../db/statistics/statistics.service";
const Moment = require("moment");

@Injectable()
export class StatisticsMiddleware implements NestMiddleware {
    constructor(private statisticsServiceDb: StatisticsServiceDb) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if(!req.originalUrl.includes("admin")) {
            const date = Moment().format("YYYY-MM-DD");
            const userInDb = await this.statisticsServiceDb.getDataByUserToday(req.socket.remoteAddress, date);

            if (!userInDb) {
                await this.statisticsServiceDb.saveData(req.socket.remoteAddress, date);
            }
            next();
        } else {
            next();
        }
    }
}
