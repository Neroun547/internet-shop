import { Module } from "@nestjs/common";
import { RubricsControllerAdmin } from "./rubrics.controller";
import { RubricsService } from "./service/rubrics.service";
import { RubricsModuleDb } from "../../../db/rubrics/rubrics.module";
import { RubricsTypesModuleDb } from "../../../db/rubrics-types/rubrics-types.module";
import { ProductsModuleDb } from "../../../db/products/products.module";
import { OrdersModuleDb } from "../../../db/orders/orders.module";
import { ProductsImagesModuleDb } from "../../../db/products-images/products-images.module";

@Module({
  imports: [RubricsModuleDb, RubricsTypesModuleDb, ProductsModuleDb, OrdersModuleDb, ProductsImagesModuleDb],
  controllers: [RubricsControllerAdmin],
  providers: [RubricsService]
})
export class RubricsModuleAdmin {}
