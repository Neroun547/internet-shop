import { Injectable } from "@nestjs/common";
import { EntityRepository, IsolationLevel } from "@mikro-orm/mysql";
import { Settings } from "./settings.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { SettingsInterface } from "./interfaces/settings.interface";
import { SettingsMapper } from "./settings.mapper";

@Injectable()
export class SettingsServiceDb {
  constructor(@InjectRepository(Settings) private repository: EntityRepository<Settings>) {}

  async getSettingByKey(settingKey: string): Promise<SettingsInterface | null> {
    const data = await this.repository.findOne({ setting_key: settingKey });

    if(!data) {
      return null;
    }
    return SettingsMapper.toDomain(data);
  }
  async saveSetting(setting: SettingsInterface) {
    await this.repository.insert(SettingsMapper.toPersist(setting));
  }
  updateManySettingsTransaction(settings: Array<SettingsInterface>): Promise<void> {
    const em = this.repository.getEntityManager();

    return new Promise((resolve, reject): void => {
      em.transactional(async (transaction) => {
        try {
          const repository = transaction.getRepository(Settings);

          for(let i = 0; i < settings.length; i++) {
            const isOldSettingExists = await repository.findOne({ setting_key: settings[i].setting_key });

            if(isOldSettingExists) {
              await repository.nativeUpdate({ setting_key: settings[i].setting_key }, { setting_value: settings[i].setting_value });
            } else {
              await repository.insert(SettingsMapper.toPersist(settings[i]));
            }
          }
          resolve();
        } catch(error) {
          reject(error);
        } 
      }, { isolationLevel: IsolationLevel.REPEATABLE_READ });
    })
  }

  async getUsersSettings(): Promise<SettingsInterface[]> {
    const data = await this.repository.find({ setting_key: { $like: "%user_setting.%" } });

    return data.map(item => SettingsMapper.toDomain(item));
  }
}
