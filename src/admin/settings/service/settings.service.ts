import { Injectable } from "@nestjs/common";
import { SettingsServiceDb } from "../../../../db/settings/settings.service";

@Injectable()
export class SettingsService {
  constructor(private settingsServiceDb: SettingsServiceDb) {}

  async registerPushMessages(subscription: any) {
    await this.settingsServiceDb.saveSetting({ setting_key: "push_messages_subscription", setting_value: JSON.stringify(subscription) });
  }
}
