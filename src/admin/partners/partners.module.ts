import { Module } from "@nestjs/common";
import { PartnersController } from "./partners.controller";
import { PartnersService } from "./service/partners.service";
import { UsersModuleDb } from "../../../db/users/users.module";

@Module({
  imports: [UsersModuleDb],
  controllers: [PartnersController],
  providers: [PartnersService]
})
export class PartnersModule {}
