import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import {ProductsModuleDb} from "../../../db/products/products.module";
import {MulterModule} from "@nestjs/platform-express";
import { ProductsImagesModuleDb } from "../../../db/products-images/products-images.module";
import { ProductsModule } from "../../products/products.module";
import { TranslateModuleDb } from "../../../db/translate/translate.module";
import { ProductsServiceAdmin } from "./service/products.service";
import { CommonModule } from "../../../common/common.module";
import { OrdersModuleDb } from "../../../db/orders/orders.module";
import { RubricsModuleDb } from "../../../db/rubrics/rubrics.module";
import { RubricsTypesModuleDb } from "../../../db/rubrics-types/rubrics-types.module";

@Module({
    imports: [
        OrdersModuleDb,
        ProductsModuleDb,
        ProductsImagesModuleDb,
        ProductsModule,
        TranslateModuleDb,
        CommonModule,
        RubricsModuleDb,
        RubricsTypesModuleDb,
        MulterModule.register({
            dest: 'static/images',
        })
    ],
    controllers: [ProductsController],
    providers: [ProductsServiceAdmin]
})
export class ProductsModuleAdmin {}
