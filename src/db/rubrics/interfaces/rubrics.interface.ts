import { RubricsTypesInterface } from "src/db/rubrics-types/interfaces/rubrics-types.interface";

export interface RubricsInterface {
  id?: number;
  name: string;
  selected_default: number;
  rubricTypes?: Array<RubricsTypesInterface>
}
