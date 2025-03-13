import { Module } from "@nestjs/common";
import { ProductsModuleDb } from "../../../db/products/products.module";
import { PricesController } from "./prices.controller";

@Module({
  imports: [ProductsModuleDb],
  controllers: [PricesController]
})
export class PricesModule {}
