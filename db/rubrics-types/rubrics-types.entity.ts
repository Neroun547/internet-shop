import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { RubricsTypesInterface } from "./interfaces/rubrics-types.interface";
import { Rubrics } from "../rubrics/rubrics.entity";

@Entity()
export class RubricsTypes implements RubricsTypesInterface {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  rubric_id: number;

  @ManyToOne({ entity: () => Rubrics })
  rubric: Rubrics;
}
