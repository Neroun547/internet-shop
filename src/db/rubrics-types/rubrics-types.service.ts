import { Injectable } from "@nestjs/common";
import { RubricsTypesInterface } from "./interfaces/rubrics-types.interface";
import { InjectRepository } from "@mikro-orm/nestjs";
import { RubricsTypes } from "./rubrics-types.entity";
import { EntityRepository } from "@mikro-orm/mysql";
import { RubricTypesMapper } from "./rubric-types.mapper";

@Injectable()
export class RubricsTypesServiceDb {
  constructor(@InjectRepository(RubricsTypes) private rubricsTypesRepository: EntityRepository<RubricsTypes>) {}

  async saveRubricsType(type: {   
      id?: number;
      name: string;
      rubric_id: number; 
      rubric: number;
    }
  ): Promise<void> {
    const rubricTypesModel = RubricTypesMapper.toPersist(type);
    
    await this.rubricsTypesRepository.getEntityManager().persist(rubricTypesModel).flush();
  }
  async getTypesByRubricId(rubricId: number): Promise<RubricsTypesInterface[]> {
    const data = await this.rubricsTypesRepository.find({ rubric_id: rubricId });

    return data.map(item => RubricTypesMapper.toDomain(item));
  }
  async deleteRubricTypesByRubricId(rubricId: number): Promise<void> {
    await this.rubricsTypesRepository.nativeDelete({ rubric_id: rubricId });
  }
  async getTypeById(id: number): Promise<RubricsTypesInterface | null> {
    const data = await this.rubricsTypesRepository.findOne({ id: id });

    if(!data) {
      return null;
    }
    return RubricTypesMapper.toDomain(data);
  }
}
