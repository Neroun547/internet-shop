import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Settings } from "./settings.entity";
import { SettingsServiceDb } from "./settings.service";

@Module({
  imports: [MikroOrmModule.forFeature([Settings])],
  providers: [SettingsServiceDb],
  exports: [SettingsServiceDb]
})
export class SettingsModuleDb {}
