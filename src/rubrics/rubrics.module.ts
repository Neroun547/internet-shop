import { Module } from "@nestjs/common";
import { RubricsTypesModuleDb } from "../../db/rubrics-types/rubrics-types.module";
import { RubricsModuleDb } from "../../db/rubrics/rubrics.module";
import { RubricsController } from "./rubrics.controller";

@Module({
  imports: [RubricsTypesModuleDb, RubricsModuleDb],
  controllers: [RubricsController]
})
export class RubricsModule {}
