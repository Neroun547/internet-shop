import {Module} from "@nestjs/common";
import {BasketController} from "./basket.controller";
import {BasketService} from "./service/basket.service";
import {ProductsImagesModuleDb} from "../../db/products-images/products-images.module";

@Module({
    imports: [ProductsImagesModuleDb],
    controllers: [BasketController],
    providers: [BasketService],
    exports: [BasketService]
})
export class BasketModule {}
