import { Module } from "@nestjs/common";
import { TranslateServiceDb } from "./translate.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Translate } from "./translate.entity";

@Module({
  imports: [MikroOrmModule.forFeature([Translate])],
  providers: [TranslateServiceDb],
  exports: [TranslateServiceDb]
})
export class TranslateModuleDb {}
