import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { RubricsTypes } from "./rubrics-types.entity";
import { RubricsTypesServiceDb } from "./rubrics-types.service";

@Module({
  imports: [MikroOrmModule.forFeature([RubricsTypes])],
  providers: [RubricsTypesServiceDb],
  exports: [RubricsTypesServiceDb]
})
export class RubricsTypesModuleDb {}
