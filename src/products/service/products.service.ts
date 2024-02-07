import { Injectable } from "@nestjs/common";
import { ProductsServiceDb } from "../../../db/products/products.service";
import {ProductsImagesServiceDb} from "../../../db/products-images/products-images.service";
import {BasketService} from "../../basket/service/basket.service";
import { translateTypeProduct } from "../../../constants";
import {OrdersServiceDb} from "../../../db/orders/orders.service";
import { CommonService } from "../../../common/common.service";
import { UsersServiceDb } from "../../../db/users/users.service";
import { RubricsTypesServiceDb } from "../../../db/rubrics-types/rubrics-types.service";
import { RubricsServiceDb } from "../../../db/rubrics/rubrics.service";

@Injectable()
export class ProductsService {
    constructor(
        private productsServiceDb: ProductsServiceDb,
        private productsImagesServiceDb: ProductsImagesServiceDb,
        private basketService: BasketService,
        private ordersServiceDb: OrdersServiceDb,
        private commonService: CommonService,
        private usersServiceDb: UsersServiceDb,
        private rubricsTypesServiceDb: RubricsTypesServiceDb,
        private rubricsServiceDb: RubricsServiceDb
    ) {}

    async parseProductsForLoadCards(productsAndImages, basket?: string) {
        const parseArr = [];

        for(let i = 0; i < productsAndImages.length; i++) {
            if(productsAndImages[i]) {

                if (basket && this.basketService.parseProductsCookie(basket).find(el => el === String(productsAndImages[i].id))) {
                    parseArr.push({
                        ...productsAndImages[i],
                        file_name: productsAndImages[i].productsImages[0] ? productsAndImages[i].productsImages[0].file_name : null,
                        inBasket: true,
                        partner: (await this.usersServiceDb.getUserById(productsAndImages[i].user_id)).role === "partner"
                    });
                } else {
                    parseArr.push({
                        ...productsAndImages[i],
                        file_name: productsAndImages[i].productsImages[0] ? productsAndImages[i].productsImages[0].file_name : null,
                        inBasket: false,
                        partner: (await this.usersServiceDb.getUserById(productsAndImages[i].user_id)).role === "partner"
                    });
                }
            }
        }
        return parseArr;
    }

    async getProductsByType(take: number, skip: number, type?: string, rubricId?: any) {
        if(!type) {
            if(!isNaN(Number(rubricId)) && Number(rubricId) !== 0) {
                return await this.productsServiceDb.getProductsAndImagesByRubricId(Number(rubricId), take, skip);
            } else {
                return await this.productsServiceDb.getProductsAndImages(take, skip);
            }
        }
        if(!isNaN(Number(type))) {
            const productType = await this.rubricsTypesServiceDb.getTypeById(Number(type));

            return await this.productsServiceDb.getProductsAndImagesByType(take, skip, productType.name);
        }
        if(type) {
            return await this.productsServiceDb.getProductsAndImagesByType(take, skip, translateTypeProduct[type]);
        }
    }

    async getProductAndImageByProductId(id: number) {
       const productAndImages = await this.productsServiceDb.getProductAndImagesById(id);

       await productAndImages.productsImages.init();

       return {
           num: productAndImages.num,
           id: productAndImages.id,
           name: productAndImages.name,
           price: productAndImages.price,
           type: productAndImages.type,
           description: productAndImages.description,
           available: productAndImages.available,
           images: [...productAndImages.productsImages].map((el) => el.file_name),
           role: (await this.usersServiceDb.getUserById(productAndImages.user_id)).role === "partner",
           rubric_id: productAndImages.rubric_id
       }
    }

    async getMaxPriceProductsByType(type: string) {
        return await this.productsServiceDb.getMaxPriceProductsByType(translateTypeProduct[type]);
    }

    async getMinPriceProductsByType(type: string) {
        return await this.productsServiceDb.getMinPriceProductsByType(translateTypeProduct[type]);
    }

    async getMaxPriceProducts() {
        return await this.productsServiceDb.getMaxPriceProducts();
    }

    async getMinPriceProducts() {
        return await this.productsServiceDb.getMinPriceProducts();
    }

    async getProductsByFilters(take: number, skip: number, available: string, priceFrom: number, priceTo: number, type: string, rubricId?: any) {

        if(!isNaN(Number(rubricId)) && Number(rubricId) !== 0) {
            if(available === "all") {
                return await this.productsServiceDb.getProductsAndImagesByFiltersAndRubricId(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], undefined, Number(rubricId));
            }
            if(available === "not_available") {
                return await this.productsServiceDb.getProductsAndImagesByFiltersAndRubricId(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], false, Number(rubricId));
            }
            if(available === "available") {
                return await this.productsServiceDb.getProductsAndImagesByFiltersAndRubricId(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], true, Number(rubricId));
            }
        } else {
            if(available === "all") {
                return await this.productsServiceDb.getProductsAndImagesByFilters(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type]);
            }
            if(available === "not_available") {
                return await this.productsServiceDb.getProductsAndImagesByFilters(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], false);
            }
            if(available === "available") {
                return await this.productsServiceDb.getProductsAndImagesByFilters(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], true);
            }
        }
    }

    async getProductsByRubricId(rubricId: number, take: number, skip: number) {
        return await this.productsServiceDb.getProductsAndImagesByRubricId(rubricId, take, skip);
    }
    async getMaxProductsPriceByRubricId(rubricId: number) {
        if(rubricId !== 0) {
            return await this.productsServiceDb.getMaxPriceProductsByRubricId(rubricId);
        } else {
            return this.productsServiceDb.getMaxPriceProducts();
        }
    }
    async getMinProductsPriceByRubricId(rubricId: number) {
        if(rubricId !== 0) {
            return await this.productsServiceDb.getMinPriceProductsByRubricId(rubricId);
        } else {
            return await this.productsServiceDb.getMinPriceProducts();
        }
    }
    async getParseRubricsForPage(rubricId) {
        const rubrics = await this.rubricsServiceDb.getAllRubrics();

        const parseRubrics = [...rubrics, { name: "Всі товари", active: false, id: 0 }];
        let activeRubricIndex;

        if (!isNaN(rubricId)) {
            activeRubricIndex = parseRubrics.findIndex(el => el.id === Number(rubricId));
        }
        if (activeRubricIndex !== -1 && parseRubrics[activeRubricIndex]) {
            //@ts-ignore
            parseRubrics[activeRubricIndex].active = true;
        } else {
            //@ts-ignore
            parseRubrics[parseRubrics.length - 1].active = true;
        }
        return parseRubrics;
    }
}
