import { Module } from "@nestjs/common";
import { RubricsController } from "./rubrics.controller";
import { RubricsService } from "./service/rubrics.service";
import { RubricsModuleDb } from "../../../db/rubrics/rubrics.module";
import { RubricsTypesModuleDb } from "../../../db/rubrics-types/rubrics-types.module";

@Module({
  imports: [RubricsModuleDb, RubricsTypesModuleDb],
  controllers: [RubricsController],
  providers: [RubricsService]
})
export class RubricsModule {}
