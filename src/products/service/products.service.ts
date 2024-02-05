import { Injectable } from "@nestjs/common";
import { ProductsServiceDb } from "../../../db/products/products.service";
import {ProductsImagesServiceDb} from "../../../db/products-images/products-images.service";
import {BasketService} from "../../basket/service/basket.service";
import { translateTypeProduct } from "../../../constants";
import {OrdersServiceDb} from "../../../db/orders/orders.service";
import { CommonService } from "../../../common/common.service";
import { UsersServiceDb } from "../../../db/users/users.service";

@Injectable()
export class ProductsService {
    constructor(
        private productsServiceDb: ProductsServiceDb,
        private productsImagesServiceDb: ProductsImagesServiceDb,
        private basketService: BasketService,
        private ordersServiceDb: OrdersServiceDb,
        private commonService: CommonService,
        private usersServiceDb: UsersServiceDb
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

    async getProductsByType(take: number, skip: number, type?: string, iso_code?: string) {
        if(!type) {
            if(iso_code && iso_code === "en") {
                const serializedData = JSON.parse(JSON.stringify(await this.productsServiceDb.getProductsAndImages(take, skip)));

                return serializedData.map(el => {
                    return {
                        ...el
                    }
                });
            } else {
                return await this.productsServiceDb.getProductsAndImages(take, skip);
            }
        }
        if(iso_code && iso_code === "en") {
            const serializedData = JSON.parse(JSON.stringify(await this.productsServiceDb.getProductsAndImagesByType(take, skip, translateTypeProduct[type])));

            return serializedData.map(el => {
                return {
                    ...el
                }
            });
        } else {
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

    async getProductsByFilters(take: number, skip: number, available: string, priceFrom: number, priceTo: number, type: string) {

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
