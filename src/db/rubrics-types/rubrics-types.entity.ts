import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { Rubrics } from "../rubrics/rubrics.entity";

@Entity()
export class RubricsTypes {
  @PrimaryKey({ type: "integer" })
  id: number;

  @Property({ type: "varchar" })
  name: string;

  rubric_id: number;

  @ManyToOne({ entity: () => Rubrics, fieldName: "rubric_id" })
  rubric: Rubrics | number;
}
