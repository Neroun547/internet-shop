import { Module } from "@nestjs/common";
import { SettingsController } from "./settings.controller";
import {
  PushServiceSubscriptionModuleDB
} from "../../../db/push-service-subscription/push-service-subscription.module";
import { SettingsService } from "./service/settings.service";

@Module({
  imports: [PushServiceSubscriptionModuleDB],
  providers: [SettingsService],
  controllers: [SettingsController]
})
export class SettingsModule {}
