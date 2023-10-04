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
}
