import { Module } from "@nestjs/common";
import {BuyController} from "./buy.controller";
import {BuyService} from "./service/buy.service";
import {ProductsModuleDb} from "../../db/products/products.module";
import {BasketModule} from "../basket/basket.module";
import {OrdersModuleDb} from "../../db/orders/orders.module";
import { TranslateModule } from "../translate/translate.module";

@Module({
    imports: [ProductsModuleDb, BasketModule, OrdersModuleDb, TranslateModule],
    controllers: [BuyController],
    providers: [BuyService]
})
export class BuyModule {}
