import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Statistics} from "./statistics.entity";
import {EntityRepository} from "@mikro-orm/mysql";

@Injectable()
export class StatisticsServiceDb {
    constructor(@InjectRepository(Statistics) private repository: EntityRepository<Statistics>) {}

    async getDataByUserToday(user: string, date: string | Date) {
        return await this.repository.findOne({ user: user, date: date });
    }
    async saveData(user: string, date: string | Date) {
        await this.repository.nativeInsert({ user: user, date: date });
    }
    async getDataByDateFromAndDateTo(dateFrom: string, dateTo: string) {
        return await
            this.repository.createQueryBuilder()
                .select("*")
                .where("date >= ?", [dateFrom])
                .andWhere("date <= ?", [dateTo])
                .getResult()

    }
}

