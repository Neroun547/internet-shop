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
    generateRandomPassword(): string {
        const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "G", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        const symbols = ["%", "*", "#", "*", ".", "_", "-"];

        let letter = false;
        let symbol = false;
        let number = false;

        let password = "";
        let randomNum;

        for(let i = 0; i < 9; i++) {
            randomNum = Math.floor(Math.random() * 3);

            if(i <= 5) {
                if (randomNum === 0) {
                    if(Math.floor(Math.random() * 2) === 1) {
                        password += letters[Math.floor(Math.random() * letters.length)];
                    } else {
                        password += letters[Math.floor(Math.random() * letters.length)].toLowerCase();
                    }
                    letter = true;
                }
                if (randomNum === 1) {
                    password += symbols[Math.floor(Math.random() * symbols.length)];
                    symbol = true;
                }
                if (randomNum === 2) {
                    password += String(Math.floor(Math.random() * 10));
                    number = true;
                }
            } else {
                if(!letter) {
                    if(Math.floor(Math.random() * 2) === 1) {
                        password += letters[Math.floor(Math.random() * letters.length)];
                    } else {
                        password += letters[Math.floor(Math.random() * letters.length)].toLowerCase();
                    }
                    letter = true;
                } else if(!symbol) {
                    password += symbols[Math.floor(Math.random() * symbols.length)];
                    symbol = true;
                } else if(!number) {
                    password += String(Math.floor(Math.random() * 10));
                    number = true;
                } else {
                    if (randomNum === 0) {
                        if(Math.floor(Math.random() * 2) === 1) {
                            password += letters[Math.floor(Math.random() * letters.length)];
                        } else {
                            password += letters[Math.floor(Math.random() * letters.length)].toLowerCase();
                        }
                        letter = true;
                    }
                    if (randomNum === 1) {
                        password += symbols[Math.floor(Math.random() * symbols.length)];
                        symbol = true;
                    }
                    if (randomNum === 2) {
                        password += String(Math.floor(Math.random() * 10));
                        number = true;
                    }
                }
            }
        }
        return password;
    }
}
