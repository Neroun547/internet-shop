import {
  Body,
  Controller, Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { Response, Request } from "express";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RubricsService } from "./service/rubrics.service";
import { CreateRubricDto } from "./dto/create-rubric.dto";
import { RubricsTypesServiceDb } from "../../../db/rubrics-types/rubrics-types.service";
import { RubricsServiceDb } from "../../../db/rubrics/rubrics.service";

@Controller()
export class RubricsController {
  constructor(
    private rubricsService: RubricsService,
    private rubricsTypesServiceDb: RubricsTypesServiceDb,
    private rubricsServiceDb: RubricsServiceDb
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getRubricsPage(@Req() req: Request, @Res() res: Response) {

    if(req["user"].role === "admin") {
      const rubrics = JSON.parse(JSON.stringify(await this.rubricsServiceDb.getAllRubricsWithTypes()));
      const rubricTypes = rubrics.map(rubric => {
        return rubric.rubricTypes.map((rubricType, i) => {

          if(i === rubric.rubricTypes.length - 1) {
            return rubricType.name += ".";
          }
          return rubricType.name += ",";
        });
      });

      res.render("admin/rubrics/rubrics", {
        admin: true,
        rubrics: rubrics,
        rubricTypes: rubricTypes,
        styles: ["/css/admin/rubrics/rubrics.css"],
        scripts: ["/js/admin/rubrics/rubrics.js"]
      });
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async createRubric(@Body() body: CreateRubricDto) {

    return { id: await this.rubricsService.createRubricAndReturnId(body.name, body.types) };
  }

  @UseGuards(AuthGuard)
  @Get(":id/rubric-types")
  async rubricTypesByRubricId(@Param("id", new ParseIntPipe()) id: number) {
    return await this.rubricsTypesServiceDb.getTypesByRubricId(id);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  async deleteRubricById(@Param("id", new ParseIntPipe()) id: number) {
    await this.rubricsService.deleteRubricById(id);

    return;
  }
}
