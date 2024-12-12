import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { SettingsInterface } from "./interfaces/settings.interface";

@Entity()
export class Settings implements SettingsInterface {
  @PrimaryKey()
  id: number;

  @Property()
  setting_key: string;

  @Property()
  setting_value: string;
}
