import { BadRequestException, Injectable } from "@nestjs/common";
import { RubricsServiceDb } from "../../../../db/rubrics/rubrics.service";
import { RubricsTypesServiceDb } from "../../../../db/rubrics-types/rubrics-types.service";

@Injectable()
export class RubricsService {
  constructor(
    private rubricsServiceDb: RubricsServiceDb,
    private rubricsTypesServiceDb: RubricsTypesServiceDb
  ) {}

  async createRubricAndReturnId(name: string, types: Array<string>): Promise<number> {
    const rubricWithTheSameName = await this.rubricsServiceDb.getRubricByName(name);

    if(rubricWithTheSameName) {
      throw new BadRequestException();
    }
    const rubricId = await this.rubricsServiceDb.createRubricAndReturnId(name, 0);

    for(let i = 0; i < types.length; i++) {
      await this.rubricsTypesServiceDb.saveRubricsType({
        name: types[i],
        rubric_id: rubricId
      })
    }
    return rubricId;
  }
  async deleteRubricById(rubricId: number) {
    await this.rubricsTypesServiceDb.deleteRubricTypesByRubricId(rubricId);
    await this.rubricsServiceDb.deleteRubricById(rubricId);
  }
}
