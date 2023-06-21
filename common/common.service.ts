import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";

@Injectable()
export class CommonService {
    generateRandomHash(size: number) {
        return randomBytes(size).toString('hex');
    }
}
