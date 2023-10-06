import { Injectable } from "@nestjs/common";
import { TranslateServiceDb } from "../../../db/translate/translate.service";
import { TranslateObjectInterface } from "../interfaces/translate-object.interface";

@Injectable()
export class TranslateService {
  constructor(private translateServiceDb: TranslateServiceDb) {}

  async getTranslateObjectByKeyAndIsoCode(key: string, isoCode: string): Promise<TranslateObjectInterface> {
    const translateByKey = JSON.parse(JSON.stringify(await this.translateServiceDb.getTranslateLikeKeyAndIsoCode(key, isoCode ? isoCode : "uk")));
    const globalTranslate = JSON.parse(JSON.stringify(await this.translateServiceDb.getTranslateLikeKeyAndIsoCode("global", isoCode ? isoCode : "uk")));

    translateByKey.push(...globalTranslate);
    return translateByKey.reduce((accumulator, currentValue) => {
      accumulator[currentValue.key] = currentValue.value;

      return accumulator;
    }, {});
  }

}
