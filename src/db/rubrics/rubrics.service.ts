import { InjectRepository } from "@mikro-orm/nestjs";
import { Rubrics } from "./rubrics.entity";
import { EntityRepository } from "@mikro-orm/mysql";
import { RubricsInterface } from "./interfaces/rubrics.interface";
import { RubricsMapper } from "./rubrics.mapper";

export class RubricsServiceDb {
  constructor(@InjectRepository(Rubrics) private repository: EntityRepository<Rubrics>) {};

  async getAllRubrics(): Promise<RubricsInterface[]> {
    const data = await this.repository.findAll();

    return data.map(item => RubricsMapper.toDomain(item));
  }
  async getAllRubricsWithTypes(): Promise<RubricsInterface[]> {
    const data = await this.repository.findAll({ populate: ["rubricTypes"] });
    
    return data.map(item => RubricsMapper.toDomainWithTypes(item));
  }
  async getRubricByName(name: string): Promise<RubricsInterface | null> {
    const data = await this.repository.findOne({ name: name });

    if(!data) {
      return null;
    }
    return RubricsMapper.toDomain(data);
  }
  async createRubricAndReturnId(name: string, selectedDefault: number): Promise<number> {
    const model = RubricsMapper.toPersist({ name: name, selected_default: selectedDefault });

    await this.repository.getEntityManager().persist(model).flush();

    return model.id;
  }
  async deleteRubricById(id: number): Promise<void> {
    await this.repository.nativeDelete({ id: id });
  }
  async getRubricsWithTypesByRubricId(rubricId: number): Promise<RubricsInterface | null> {
    const data = await this.repository.findOne({ id: rubricId }, { populate: ["rubricTypes"] });

    if(!data) {
      return null;
    }
    return RubricsMapper.toDomainWithTypes(data);
  }
  async updateRubricNameById(name: string, id: number): Promise<void> {
    await this.repository.nativeUpdate({ id: id }, { name: name });
  }

  async getRubricById(rubricId: number): Promise<RubricsInterface | null> {
    const data = await this.repository.findOne({ id: rubricId });

    if(!data) {
      return null;
    }
    return RubricsMapper.toDomain(data);
  }
}
