import { Injectable } from "@nestjs/common";
import { TranslateServiceDb } from "../../../db/translate/translate.service";
import { TranslateObjectInterface } from "../interfaces/translate-object.interface";

@Injectable()
export class TranslateService {
  constructor(private translateServiceDb: TranslateServiceDb) {}

  async getTranslateObjectByKeyAndIsoCode(key: string, isoCode: string): Promise<TranslateObjectInterface> {
    const serializedData = JSON.parse(JSON.stringify(await this.translateServiceDb.getTranslateLikeKeyAndIsoCode(key, isoCode ? isoCode : "uk")));
    const pageTranslateSerialized = JSON.parse(JSON.stringify(await this.translateServiceDb.getTranslateLikeKeyAndIsoCode("global", isoCode ? isoCode : "uk")));

    serializedData.push(...pageTranslateSerialized);

    return serializedData.reduce((accumulator, currentValue) => {
      accumulator[currentValue.key] = currentValue.value;

      return accumulator;
    }, {});
  }

}
