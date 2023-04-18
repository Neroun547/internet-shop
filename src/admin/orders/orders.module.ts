import { Module } from "@nestjs/common";
import {OrdersController} from "./orders.controller";
import {OrdersService} from "./service/orders.service";
import {OrdersModuleDb} from "../../../db/orders/orders.module";

@Module({
    imports: [OrdersModuleDb],
    controllers: [OrdersController],
    providers: [OrdersService]
})
export class OrdersModule {}
