import { Module } from "@nestjs/common";
import {ProductsModuleDb} from "../../db/products/products.module";
import {ProductsController} from "./products.controller";
import {ProductsImagesModuleDb} from "../../db/products-images/products-images.module";
import {ProductsService} from "./service/products.service";
import {BasketModule} from "../basket/basket.module";
import {OrdersModuleDb} from "../../db/orders/orders.module";
import { TranslateModule } from "../translate/translate.module";

@Module({
   imports: [BasketModule, ProductsModuleDb, ProductsImagesModuleDb, OrdersModuleDb, TranslateModule],
   controllers: [ProductsController],
   providers: [ProductsService],
   exports: [ProductsService]
})
export class ProductsModule {}
