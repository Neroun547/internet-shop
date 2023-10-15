import { Injectable } from "@nestjs/common";
import {
  PushServiceSubscriptionServiceDb
} from "../../../../db/push-service-subscription/push-service-subscription.service";

@Injectable()
export class SettingsService {
  constructor(private pushServiceSubscriptionServiceDb: PushServiceSubscriptionServiceDb) {}

  async saveSubscription(userId: number, subscription: string, active: boolean) {
    const userInDb = await this.pushServiceSubscriptionServiceDb.getSubscriptionByUserId(userId);

    if(userInDb) {
      await this.pushServiceSubscriptionServiceDb.updateSubscriptionByUserId(userId, subscription, active);
    } else {
      await this.pushServiceSubscriptionServiceDb.saveSubscription(userId, subscription, active);
    }
  }
}
