import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { TranslateInterface } from "./interfaces/translate.interface";

@Entity()
export class Translate implements TranslateInterface {
  @PrimaryKey()
  id: number;

  @Property()
  key: string;

  @Property()
  iso_code: string;

  @Property()
  value: string;
}
