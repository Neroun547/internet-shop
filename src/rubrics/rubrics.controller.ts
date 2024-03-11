import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { RubricsTypesServiceDb } from "../../db/rubrics-types/rubrics-types.service";
import { RubricsServiceDb } from "../../db/rubrics/rubrics.service";

@Controller()
export class RubricsController {
  constructor(
    private rubricsServiceDb: RubricsServiceDb,
    private rubricsTypesServiceDb: RubricsTypesServiceDb
  ) {}

  @Get()
  async getAllRubrics() {
    return await this.rubricsServiceDb.getAllRubrics();
  }

  @Get("rubrics-types/:rubricId")
  async getRubricsTypesByRubricId(@Param("rubricId", new ParseIntPipe()) rubricId: number) {
    return await this.rubricsTypesServiceDb.getTypesByRubricId(rubricId);
  }
}
