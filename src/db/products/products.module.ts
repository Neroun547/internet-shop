import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Products} from "./products.entity";
import {ProductsServiceDb} from "./products.service";

@Module({
    imports: [MikroOrmModule.forFeature([Products])],
    providers: [ProductsServiceDb],
    exports: [ProductsServiceDb]
})
export class ProductsModuleDb {}
