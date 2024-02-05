import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";
import { request } from "https";

@Injectable()
export class CommonService {
    generateRandomHash(size: number) {
        return randomBytes(size).toString('hex');
    }
    promisifyHttpsRequest(url) {
        return new Promise((resolve, reject) => {
            const api = request(url, (res) => {
                let strData = "";

                res.on("data", (data) => {
                    strData += data;
                });

                res.on("end", () => {
                    resolve(strData);
                });
            });
            api.on("error", () => {
                reject();
            });
            api.end();
        });
    }
}
