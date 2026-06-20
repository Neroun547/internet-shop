import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { SettingsServiceDb } from "../../../db/settings/settings.service";
import { UpdateSettingsDto } from "../dto/update-settings.dto";
import { SettingsInterface } from "src/db/settings/interfaces/settings.interface";

@Injectable()
export class SettingsService {
  constructor(private settingsServiceDb: SettingsServiceDb) {}

  async registerPushMessages(subscription: any) {
    await this.settingsServiceDb.saveSetting({ setting_key: "push_messages_subscription", setting_value: JSON.stringify(subscription) });
  }

  async updateSettings(data: UpdateSettingsDto, userId: number) {
    const settingsArr: Array<SettingsInterface> = [];

    for(let key in data) {
      if(key === "email") {
        settingsArr.push({
          setting_key: "user_setting.push_message.email." + userId,
          setting_value: data[key]
        })
      }
      if(key === "isEmailNotificationEnabled") {
        settingsArr.push({
          setting_key: "user_setting.push_message.is_email_notification_enabled." + userId,
          setting_value: String(data[key])
        });
      }
    }
    try {
      await this.settingsServiceDb.updateManySettingsTransaction(settingsArr);
    } catch(error) {
      console.log("Transaction error:", error);
      throw new InternalServerErrorException({ message: "Transaction error" });
    }
  }

  async getSettingsByUserId(userId: number) {
    const data = await this.settingsServiceDb.getUsersSettings();

    const resultObject = {
      email: "",
      isEmailNotificationEnabled: false
    }
    for(const setting of data) {
      if(setting.setting_key === "user_setting.push_message.email." + userId) {
        resultObject.email = setting.setting_value;
      }
      if(setting.setting_key === "user_setting.push_message.is_email_notification_enabled." + userId) {
        resultObject.isEmailNotificationEnabled = setting.setting_value === "true"
      }
    }
    return resultObject;
  }
}
