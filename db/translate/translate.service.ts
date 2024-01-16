import { Injectable } from "@nestjs/common";
import { Translate } from "./translate.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/mysql";

@Injectable()
export class TranslateServiceDb {
  constructor(@InjectRepository(Translate) private repository: EntityRepository<Translate>) {}

  async getTranslateLikeKeyAndIsoCode(key: string, isoCode: string) {
    return await this.repository.find({ key: { $like: "%" + key + "%" }, iso_code: isoCode });
  }
  async saveTranslate(key: string, value: string, isoCode: string) {
    await this.repository.nativeInsert({ key: key, value: value, iso_code: isoCode });
  }
  async updateTranslateByKeyAndIsoCode(key: string, value: string, isoCode: string) {
    await this.repository.nativeUpdate({ key: key, iso_code: isoCode }, { value: value });
  }
  async getTranslateByKeyAndIsoCode(key: string, isoCode: string) {
    return await this.repository.findOne({ key: key, iso_code: isoCode });
  }
}
