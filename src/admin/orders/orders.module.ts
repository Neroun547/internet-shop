import { Module } from "@nestjs/common";
import {OrdersController} from "./orders.controller";
import {OrdersService} from "./service/orders.service";
import {OrdersModuleDb} from "../../../db/orders/orders.module";
import { UsersModuleDb } from "../../../db/users/users.module";

@Module({
    imports: [OrdersModuleDb, UsersModuleDb],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService]
})
export class OrdersModule {}
