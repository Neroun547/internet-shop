import { InjectRepository } from "@mikro-orm/nestjs";
import { Rubrics } from "./rubrics.entity";
import { EntityRepository } from "@mikro-orm/mysql";

export class RubricsServiceDb {
  constructor(@InjectRepository(Rubrics) private repository: EntityRepository<Rubrics>) {};

  async getAllRubrics() {
    return await this.repository.findAll();
  }
  async getAllRubricsWithTypes() {
    return await this.repository.findAll({ populate: ["rubricTypes"] });
  }
  async getRubricByName(name: string) {
    return await this.repository.findOne({ name: name });
  }
  async createRubricAndReturnId(name: string, selectedDefault: number): Promise<number> {
    const model = new Rubrics();

    model.name = name;
    model.selected_default = selectedDefault;

    await this.repository.persistAndFlush(model);

    return model.id;
  }
  async deleteRubricById(id: number) {
    await this.repository.nativeDelete({ id: id });
  }
  async getRubricsWithTypesByRubricId(rubricId: number) {
    return await this.repository.findOne({ id: rubricId }, { populate: ["rubricTypes"] });
  }
  async updateRubricNameById(name: string, id: number) {
    await this.repository.nativeUpdate({ id: id }, { name: name });
  }

  async getRubricById(rubricId: number) {
    return await this.repository.findOne({ id: rubricId });
  }
}
