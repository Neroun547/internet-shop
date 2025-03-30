import { Injectable } from "@nestjs/common";
import { SettingsServiceDb } from "../../../../db/settings/settings.service";

@Injectable()
export class SettingsService {
  constructor(private settingsServiceDb: SettingsServiceDb) {}

  async registerPushMessages(subscription: any) {
    await this.settingsServiceDb.saveSetting({ setting_key: "push_messages_subscription", setting_value: JSON.stringify(subscription) });
  }
  async getAdminSettings() {
    const data = await this.settingsServiceDb.getAdminSettings();
    const parsedData = {};

    for(let i = 0; i < data.length; i++) {
      parsedData[data[i].setting_key] = {
        id: data[i].id,
        value: data[i].setting_value
      };
    }
    return parsedData;
  }
  async saveAdminSettings(data) {
    for(let key in data) {
      if(data[key].id) {
        await this.settingsServiceDb.updateSettingById(data[key].id, data[key].value);
      } else {
        await this.settingsServiceDb.saveSetting({
          setting_key: key,
          setting_value: data[key].value
        });
      }
    }
  }
}
