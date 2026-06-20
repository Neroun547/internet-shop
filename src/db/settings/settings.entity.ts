import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity()
export class Settings {
  @PrimaryKey({ type: "integer" })
  id: number;

  @Property({ type: "varchar" })
  setting_key: string;

  @Property({ type: "text" })
  setting_value: string;
}
