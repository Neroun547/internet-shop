import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {ProductsImages} from "./products-images.entity";
import {ProductsImagesServiceDb} from "./products-images.service";

@Module({
    imports: [MikroOrmModule.forFeature([ProductsImages])],
    providers: [ProductsImagesServiceDb],
    exports: [ProductsImagesServiceDb]
})
export class ProductsImagesModuleDb {}
