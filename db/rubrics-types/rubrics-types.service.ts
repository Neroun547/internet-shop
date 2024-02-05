import { Injectable } from "@nestjs/common";
import { RubricsTypesInterface } from "./interfaces/rubrics-types.interface";
import { InjectRepository } from "@mikro-orm/nestjs";
import { RubricsTypes } from "./rubrics-types.entity";
import { EntityRepository } from "@mikro-orm/mysql";

@Injectable()
export class RubricsTypesServiceDb {
  constructor(@InjectRepository(RubricsTypes) private rubricsTypesRepository: EntityRepository<RubricsTypes>) {}

  async saveRubricsType(type: RubricsTypesInterface) {
    await this.rubricsTypesRepository.nativeInsert(type);
  }
  async getTypesByRubricId(rubricId: number) {
    return await this.rubricsTypesRepository.find({ rubric_id: rubricId });
  }
  async deleteRubricTypesByRubricId(rubricId: number) {
    await this.rubricsTypesRepository.nativeDelete({ rubric_id: rubricId });
  }
}
