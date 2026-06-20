import { RubricsInterface } from "./interfaces/rubrics.interface";
import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { RubricsTypes } from "../rubrics-types/rubrics-types.entity";
import { Collection } from "@mikro-orm/core";

@Entity()
export class Rubrics {
  @PrimaryKey({ type: "integer" })
  id: number;

  @Property({ type: "varchar" })
  name: string;

  @Property({ type: "integer" })
  selected_default: number;

  @OneToMany({ entity: () => RubricsTypes, mappedBy: "rubric" })
  rubricTypes: Collection<RubricsTypes>;
}
