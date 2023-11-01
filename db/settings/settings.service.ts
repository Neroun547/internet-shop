import { Injectable } from "@nestjs/common";
import { EntityRepository } from "@mikro-orm/mysql";
import { Settings } from "./settings.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { SettingsInterface } from "./interfaces/settings.interface";

@Injectable()
export class SettingsServiceDb {
  constructor(@InjectRepository(Settings) private repository: EntityRepository<Settings>) {}

  async getSettingByKey(settingKey: string): Promise<Settings> {
    return await this.repository.findOne({ setting_key: settingKey });
  }
  async saveSetting(setting: SettingsInterface) {
    await this.repository.nativeInsert(setting);
  }
}
