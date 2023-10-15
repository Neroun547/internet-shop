import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PushServiceSubscription } from "./push-service-subscription.entity";
import { PushServiceSubscriptionServiceDb } from "./push-service-subscription.service";

@Module({
  imports: [MikroOrmModule.forFeature([PushServiceSubscription])],
  providers: [PushServiceSubscriptionServiceDb],
  exports: [PushServiceSubscriptionServiceDb]
})
export class PushServiceSubscriptionModuleDB {}
