import { Injectable } from "@nestjs/common";
import { ProductsServiceDb } from "../../../db/products/products.service";
import {ProductsImagesServiceDb} from "../../../db/products-images/products-images.service";
import {ProductsInterface} from "../../../db/products/interfaces/products.interface";
import { rename } from "fs/promises";
import {BasketService} from "../../basket/service/basket.service";
import { translateTypeProduct } from "../../../constants";
import {OrdersServiceDb} from "../../../db/orders/orders.service";

@Injectable()
export class ProductsService {
    constructor(
        private productsServiceDb: ProductsServiceDb,
        private productsImagesServiceDb: ProductsImagesServiceDb,
        private basketService: BasketService,
        private ordersServiceDb: OrdersServiceDb
    ) {}

    parseProductsForLoadCards(productsAndImages, basket: string) {
        const parseArr = [];

        for(let i = 0; i < productsAndImages.length; i++) {
            if(basket && this.basketService.parseProductsCookie(basket).find(el => el === String(productsAndImages[i].id))) {
                parseArr.push({
                    ...productsAndImages[i],
                    file_name: productsAndImages[i].productsImages[0].file_name,
                    inBasket: true
                });
            } else {
                parseArr.push({
                    ...productsAndImages[i],
                    file_name: productsAndImages[i].productsImages[0].file_name,
                    inBasket: false
                });
            }
        }
        return parseArr;
    }

    async getProductsByType(take: number, skip: number, type?: string) {
        if(!type) {
            return await this.productsServiceDb.getProductsAndImages(take, skip);
        }
        return await this.productsServiceDb.getProductsAndImagesByType(take, skip, translateTypeProduct[type]);
    }

    async uploadProduct(product: ProductsInterface, files: Array<Express.Multer.File>) {
        const savedProduct = await this.productsServiceDb.saveProductAndReturn(product);

        for(let i = 0; i < files.length; i++) {
            if(files[i].mimetype === "image/jpeg") {
                await rename(files[i].path, "static/images/" + files[i].filename + ".jpeg");
                await this.productsImagesServiceDb.saveProductImage({
                    file_name: files[i].filename + ".jpeg",
                    product: savedProduct.id
                });
            }
            if(files[i].mimetype === "image/png") {
                await rename(files[i].path, "static/images/" + files[i].filename + ".png");
                await this.productsImagesServiceDb.saveProductImage({
                    file_name: files[i].filename + ".png",
                    product: savedProduct.id
                });
            }
            if(files[i].mimetype === "image/jpg") {
                await rename(files[i].path, "static/images/" + files[i].filename + ".jpg");
                await this.productsImagesServiceDb.saveProductImage({
                    file_name: files[i].filename + ".jpg",
                    product: savedProduct.id
                });
            }
        }
    }

    async updateProductById(id: number, product: ProductsInterface, files: Array<Express.Multer.File>) {
        await this.productsServiceDb.updateProductById(id, product);

        if(files.length) {
            await this.productsImagesServiceDb.deleteProductImageByProductId(id);

            for(let i = 0; i < files.length; i++) {
                if(files[i].mimetype === "image/jpeg") {
                    await rename(files[i].path, "static/images/" + files[i].filename + ".jpeg");
                    await this.productsImagesServiceDb.saveProductImage({
                        file_name: files[i].filename + ".jpeg",
                        product: id
                    });
                }
                if(files[i].mimetype === "image/png") {
                    await rename(files[i].path, "static/images/" + files[i].filename + ".png");
                    await this.productsImagesServiceDb.saveProductImage({
                        file_name: files[i].filename + ".png",
                        product: id
                    });
                }
                if(files[i].mimetype === "image/jpg") {
                    await rename(files[i].path, "static/images/" + files[i].filename + ".jpg");
                    await this.productsImagesServiceDb.saveProductImage({
                        file_name: files[i].filename + ".jpg",
                        product: id
                    });
                }
            }
        }
    }

    async getProductAndImageByProductId(id: number) {
       const productAndImages = await this.productsServiceDb.getProductAndImagesById(id);

       await productAndImages.productsImages.init();

       return {
           id: productAndImages.id,
           name: productAndImages.name,
           price: productAndImages.price,
           type: productAndImages.type,
           description: productAndImages.description,
           available: productAndImages.available,
           images: [...productAndImages.productsImages].map((el) => el.file_name)
       }
    }

    async deleteProductById(id: number) {
        const productAndImages = await this.productsServiceDb.getProductAndImagesById(id);

        for(let i = 0; i < productAndImages.productsImages.length; i++) {
            await this.productsImagesServiceDb.deleteProductImageById(productAndImages.productsImages[i].id);
        }
        await this.ordersServiceDb.deleteOrdersByProductId(id);
        await this.productsServiceDb.deleteProductById(id);
    }
}
