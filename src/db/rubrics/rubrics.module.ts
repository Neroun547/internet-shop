import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Rubrics } from "./rubrics.entity";
import { RubricsServiceDb } from "./rubrics.service";

@Module({
  imports: [MikroOrmModule.forFeature([Rubrics])],
  providers: [RubricsServiceDb],
  exports: [RubricsServiceDb]
})
export class RubricsModuleDb {}
