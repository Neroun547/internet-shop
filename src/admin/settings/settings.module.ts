import { Module } from "@nestjs/common";
import { SettingsController } from "./settings.controller";
import { SettingsService } from "./service/settings.service";
import { SettingsModuleDb } from "../../../db/settings/settings.module";

@Module({
  imports: [SettingsModuleDb],
  controllers: [SettingsController],
  providers: [SettingsService]
})
export class SettingsModule {}
