import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Orders} from "./orders.entity";
import {OrdersServiceDb} from "./orders.service";

@Module({
    imports: [MikroOrmModule.forFeature([Orders])],
    providers: [OrdersServiceDb],
    exports: [OrdersServiceDb]
})
export class OrdersModuleDb {}
