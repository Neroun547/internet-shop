import {
  Body,
  Controller, Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe, Patch,
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
import { UpdateRubricDto } from "./dto/update-rubric.dto";

@Controller()
export class RubricsControllerAdmin {
  constructor(
    private rubricsService: RubricsService,
    private rubricsTypesServiceDb: RubricsTypesServiceDb,
    private rubricsServiceDb: RubricsServiceDb
  ) {}


  @UseGuards(AuthGuard)
  @Get(":id")
  async getRubricById(@Param("id", new ParseIntPipe()) rubricId: number) {
    return await this.rubricsServiceDb.getRubricById(rubricId);
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

  @UseGuards(AuthGuard)
  @Patch()
  async updateRubric(@Body() body: UpdateRubricDto) {
    await this.rubricsService.updateRubric(body);
  }
}
