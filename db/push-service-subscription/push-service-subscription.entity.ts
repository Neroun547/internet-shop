import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { PushServiceSubscriptionInterface } from "./interfaces/push-service-subscription.interface";

@Entity()
export class PushServiceSubscription implements PushServiceSubscriptionInterface {
  @PrimaryKey()
  id: number;

  @Property()
  data: JSON | string;

  @Property()
  user_id: number;

  @Property()
  active: boolean;
}
