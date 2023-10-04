import { Module } from "@nestjs/common";
import { TranslateController } from "./translate.controller";
import { TranslateService } from "./service/translate.service";
import { TranslateModuleDb } from "../../db/translate/translate.module";

@Module({
  imports: [TranslateModuleDb],
  controllers: [TranslateController],
  providers: [TranslateService],
  exports: [TranslateService]
})
export class TranslateModule {}
