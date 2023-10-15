import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { PushServiceSubscription } from "./push-service-subscription.entity";
import { EntityRepository } from "@mikro-orm/mysql";

@Injectable()
export class PushServiceSubscriptionServiceDb {
  constructor(@InjectRepository(PushServiceSubscription) private repository: EntityRepository<PushServiceSubscription>) {}

  async saveSubscription(userId: number, data: string, active: boolean) {
    await this.repository.nativeInsert({ user_id: userId, data: data, active: active });
  }
  async getSubscriptionByUserId(userId: number) {
    return await this.repository.findOne({ user_id: userId });
  }
  async updateSubscriptionByUserId(userId: number, data: string, active: boolean) {
    await this.repository.nativeUpdate({ user_id: userId }, { data: data, active: active });
  }
}
