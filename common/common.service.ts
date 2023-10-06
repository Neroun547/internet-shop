import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";
import { request } from "https";
import { translateTypeProduct } from "../constants";
import { GetTypeProductByValueInterface } from "./interfaces/get-type-product-by-value.interface";

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
    getTypeProductByValue(value: string): GetTypeProductByValueInterface {
        for(const key in translateTypeProduct) {
            if(translateTypeProduct[key] === value) {
                return { key: key, value: translateTypeProduct[key] }
            }
        }
    }
}
