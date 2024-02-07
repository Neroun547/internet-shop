import {Module} from "@nestjs/common";
import {BasketController} from "./basket.controller";
import {BasketService} from "./service/basket.service";
import {ProductsImagesModuleDb} from "../../db/products-images/products-images.module";
import { TranslateModule } from "../translate/translate.module";
import { RubricsTypesModuleDb } from "../../db/rubrics-types/rubrics-types.module";

@Module({
    imports: [ProductsImagesModuleDb, TranslateModule, RubricsTypesModuleDb],
    controllers: [BasketController],
    providers: [BasketService],
    exports: [BasketService]
})
export class BasketModule {}
