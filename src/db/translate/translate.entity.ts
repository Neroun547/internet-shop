import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { TranslateInterface } from "./interfaces/translate.interface";

@Entity()
export class Translate implements TranslateInterface {
  @PrimaryKey({ type: "integer" })
  id: number;

  @Property({ type: "varchar" })
  key: string;

  @Property({ type: "varchar" })
  iso_code: string;

  @Property({ type: "text" })
  value: string;
}
