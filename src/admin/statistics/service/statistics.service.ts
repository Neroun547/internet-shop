import { Injectable } from "@nestjs/common";
import {StatisticsServiceDb} from "../../../../db/statistics/statistics.service";
const Moment = require("moment");

@Injectable()
export class StatisticsService {
    constructor(private statisticsServiceDb: StatisticsServiceDb) {}

    parseStatisticData(data) {
        let objectWithCountVisitsAndDateKey = {};

        for(let i = 0; i < data.length; i++) {
            if(!objectWithCountVisitsAndDateKey[data[i].date]) {
                objectWithCountVisitsAndDateKey[data[i].date] = { count: 1, users: [data[i]] }
            } else {
                objectWithCountVisitsAndDateKey[data[i].date].count += 1;
                objectWithCountVisitsAndDateKey[data[i].date].users.push(data[i]);
            }
        }
        const countDates = Object.keys(objectWithCountVisitsAndDateKey).length;

        const parseData = [];

        objectWithCountVisitsAndDateKey = this.sortDataInObj(objectWithCountVisitsAndDateKey);

        if(countDates > 10) {
            const countDates = Math.floor(Object.keys(objectWithCountVisitsAndDateKey).length / 10);
            const parseData = [];
            let remainder = Math.floor(Object.keys(objectWithCountVisitsAndDateKey).length) % 10;

            let tmp;
            let j;

            while(Object.keys(objectWithCountVisitsAndDateKey).length) {
                j = countDates;
                tmp = { dateTo: "", dateFrom: "", countVisits: 0, users: [] };

                if(remainder > 0) {
                    j += 1;
                }
                let countDeleteProperty = j;

                for(let key in objectWithCountVisitsAndDateKey) {

                    if(j < 0) {
                        break;
                    }
                    if((j === countDates && remainder <= 0) || j === countDates + 1) {
                        tmp.dateFrom = key;
                    }
                    if(j === 0) {
                        tmp.dateTo = key;
                    }
                    tmp.countVisits += objectWithCountVisitsAndDateKey[key].count;
                    tmp.users.push(...objectWithCountVisitsAndDateKey[key].users);

                    j-=1;
                }
                remainder-=1;
                objectWithCountVisitsAndDateKey = this.deletePropertyFromObject(objectWithCountVisitsAndDateKey, countDeleteProperty);
                parseData.push(tmp);
                tmp = {}
            }
            return this.sortDataInArr(parseData);
        } else {
            for(let key in objectWithCountVisitsAndDateKey) {
                parseData.push({ dateFrom: key, dateTo: key, countVisits: objectWithCountVisitsAndDateKey[key].count, users: objectWithCountVisitsAndDateKey[key].users  })
            }
            return this.sortDataInArr(parseData);
        }
    }

    async getDataByDateFromAndDateTo(dateFrom: string, dateTo: string) {
        const data = JSON.parse(JSON.stringify(await this.statisticsServiceDb.getDataByDateFromAndDateTo(dateFrom, dateTo)));

        return this.parseStatisticData(data);
    }

    sortDataInArr(data) {
        for(let i = 0; i < data.length; i++) {
            for(let j = 0; j < data.length; j++) {
                if(j+1 < data.length && Moment(data[j+1].dateTo).isBefore(data[j].dateTo)) {
                    let tmp = data[j];

                    data[j] = data[j+1];
                    data[j+1]= tmp;
                }
            }
        }

        return data;
    }

    sortDataInObj(obj) {
        const arrKeys = Object.keys(obj).sort((a, b) => Moment(a).isBefore(b));

        for(let i = 0; i < arrKeys.length; i++) {
            for(let j = 0; j < arrKeys.length; j++) {
                if(j+1 < arrKeys.length && Moment(arrKeys[j+1]).isBefore(arrKeys[j])) {
                    let tmp = arrKeys[j];

                    arrKeys[j] = arrKeys[j+1];
                    arrKeys[j+1]= tmp;
                }
            }
        }
        const parseObj = {};

        for(let i = 0; i < arrKeys.length; i++) {
            parseObj[arrKeys[i]] = obj[arrKeys[i]];
        }

        return parseObj;
    }

    deletePropertyFromObject(obj, count) {
        for(let key in obj) {
            if(count === 0) {
                break;
            }
            delete obj[key];

            count -= 1;
        }

        return obj;
    }
}
