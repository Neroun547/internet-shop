import { Module } from "@nestjs/common";
import {ProductsModuleDb} from "../../db/products/products.module";
import {ProductsController} from "./products.controller";
import {ProductsImagesModuleDb} from "../../db/products-images/products-images.module";
import {ProductsService} from "./service/products.service";
import {OrdersModuleDb} from "../../db/orders/orders.module";
import { TranslateModule } from "../translate/translate.module";
import { CommonModule } from "../../common/common.module";
import { TranslateModuleDb } from "../../db/translate/translate.module";
import { UsersModuleDb } from "../../db/users/users.module";
import { RubricsTypesModuleDb } from "../../db/rubrics-types/rubrics-types.module";
import { RubricsModuleDb } from "../../db/rubrics/rubrics.module";
import { PricesModule } from "./prices/prices.module";

@Module({
   imports: [
      ProductsModuleDb,
      ProductsImagesModuleDb,
      OrdersModuleDb,
      TranslateModule,
      TranslateModuleDb,
      CommonModule,
      UsersModuleDb,
      RubricsTypesModuleDb,
      RubricsModuleDb,
      PricesModule
   ],
   controllers: [ProductsController],
   providers: [ProductsService],
   exports: [ProductsService]
})
export class ProductsModule {}
