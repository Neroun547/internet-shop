import { RubricsInterface } from "./interfaces/rubrics.interface";
import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { RubricsTypes } from "../rubrics-types/rubrics-types.entity";

@Entity()
export class Rubrics implements RubricsInterface {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  selected_default: number;

  @OneToMany({ entity: () => RubricsTypes, mappedBy: "rubric" })
  rubricTypes: Collection<RubricsTypes>;
}
