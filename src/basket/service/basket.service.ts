import { Injectable} from "@nestjs/common";
import {ProductsImagesServiceDb} from "../../../db/products-images/products-images.service";
import {LoadProductsBasketInterface} from "../interfaces/load-products-basket.interface";

@Injectable()
export class BasketService {
    constructor(
        private productsImagesServiceDb: ProductsImagesServiceDb,
    ) {}

    parseProductsCookie(str: string) {
        return str.split(",");
    }

    parseProductsAndProductsImagesForBasket (productsImagesAndProducts) {
        const parseArr = [];
        let sum = 0;

        for(let i = 0; i < productsImagesAndProducts.length; i++) {

            if(parseArr.findIndex((el) => el.id === productsImagesAndProducts[i].product.id) === -1) {
                parseArr.push({
                    ...productsImagesAndProducts[i].product,
                    file_name: productsImagesAndProducts[i].file_name,
                    inBasket: false
                });
                sum += productsImagesAndProducts[i].product.price;
            }
        }
        return { data: parseArr, sum: sum };
    }

    async getBasketProducts(basket: string): Promise<LoadProductsBasketInterface | false> {
        if(basket) {
            const parseBasket = this.parseProductsCookie(basket);

            return this.parseProductsAndProductsImagesForBasket(await this.productsImagesServiceDb.getProductsImagesAndProductsByProductsId(parseBasket.map(el => Number(el))));
        }
        return false;
    }
}
