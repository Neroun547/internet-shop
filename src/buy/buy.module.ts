import { Module } from "@nestjs/common";
import {BuyController} from "./buy.controller";
import {BuyService} from "./service/buy.service";
import {ProductsModuleDb} from "../../db/products/products.module";
import {OrdersModuleDb} from "../../db/orders/orders.module";
import { TranslateModule } from "../translate/translate.module";
import { SettingsModuleDb } from "../../db/settings/settings.module";

@Module({
    imports: [ProductsModuleDb, OrdersModuleDb, TranslateModule, SettingsModuleDb],
    controllers: [BuyController],
    providers: [BuyService]
})
export class BuyModule {}
