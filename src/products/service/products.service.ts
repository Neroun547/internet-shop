import {Injectable, NotFoundException} from "@nestjs/common";
import { ProductsServiceDb } from "../../../db/products/products.service";
import {ProductsImagesServiceDb} from "../../../db/products-images/products-images.service";
import { rename } from "fs/promises";
import {BasketService} from "../../basket/service/basket.service";
import { translateTypeProduct } from "../../../constants";
import {OrdersServiceDb} from "../../../db/orders/orders.service";
import { unlink } from "fs/promises";
import { resolve } from "path";
import { CommonService } from "../../../common/common.service";
import { UploadProductInterface } from "../interfaces/upload-product.interface";
import { TranslateServiceDb } from "../../../db/translate/translate.service";

@Injectable()
export class ProductsService {
    constructor(
        private productsServiceDb: ProductsServiceDb,
        private productsImagesServiceDb: ProductsImagesServiceDb,
        private basketService: BasketService,
        private ordersServiceDb: OrdersServiceDb,
        private commonService: CommonService,
        private translateServiceDb: TranslateServiceDb
    ) {}

    parseProductsForLoadCards(productsAndImages, basket?: string) {
        const parseArr = [];

        for(let i = 0; i < productsAndImages.length; i++) {
            if(productsAndImages[i]) {

                if (basket && this.basketService.parseProductsCookie(basket).find(el => el === String(productsAndImages[i].id))) {
                    parseArr.push({
                        ...productsAndImages[i],
                        file_name: productsAndImages[i].productsImages[0] ? productsAndImages[i].productsImages[0].file_name : null,
                        inBasket: true
                    });
                } else {
                    parseArr.push({
                        ...productsAndImages[i],
                        file_name: productsAndImages[i].productsImages[0] ? productsAndImages[i].productsImages[0].file_name : null,
                        inBasket: false
                    });
                }
            }
        }
        return parseArr;
    }

    async deleteProductImages(productImages) {
        for(let i = 0; i < productImages.length; i++) {
            try {
                await unlink(resolve("static/images/" + productImages[i].file_name));
            } catch {

            }
        }
    }

    async getProductsByType(take: number, skip: number, type?: string, iso_code?: string) {
        if(!type) {
            if(iso_code && iso_code === "en") {
                const serializedData = JSON.parse(JSON.stringify(await this.productsServiceDb.getProductsAndImages(take, skip)));

                return serializedData.map(el => {
                    return {
                        ...el,
                        type: this.commonService.getTypeProductByValue(el.type).key
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
                    ...el,
                    type: this.commonService.getTypeProductByValue(el.type).key
                }
            });
        } else {
            return await this.productsServiceDb.getProductsAndImagesByType(take, skip, translateTypeProduct[type]);
        }
    }

    async uploadProduct(product: UploadProductInterface, files: Array<Express.Multer.File>) {
        const lastProduct = (await this.productsServiceDb.getLastProductByNum());
        const savedProduct = await this.productsServiceDb.saveProductAndReturn({...product, num: lastProduct ? lastProduct.num + 1 : 1});

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
        await this.translateServiceDb.saveTranslate("product_translate_" + savedProduct.id, product.translate, product.translate_language);
        await this.translateServiceDb.saveTranslate("product_translate_description_" + savedProduct.id, product.translate_description, product.translate_language_description)
    }

    async updateProductById(id: number, product: UploadProductInterface, files: Array<Express.Multer.File>, userId: number) {
        const productInDbWithSimilarNum = JSON.parse(JSON.stringify(await this.productsServiceDb.getProductByNum(product.num)));

        if(productInDbWithSimilarNum) {
            const updatedProductInDb = await this.productsServiceDb.getProductById(id);

            delete productInDbWithSimilarNum.productsImages;

            await this.productsServiceDb.updateProductById(productInDbWithSimilarNum.id, { ...productInDbWithSimilarNum, num: updatedProductInDb.num });
        }
        await this.productsServiceDb.updateProductById(id, {
            name: product.name,
            description: product.description,
            price: product.price,
            available: product.available,
            type: product.type,
            num: product.num,
            user_id: userId
        });

        if(files.length) {
            const productImages = await this.productsImagesServiceDb.getProductImagesByProductId(id);

            await this.deleteProductImages(productImages);

            await this.productsImagesServiceDb.deleteProductImagesByProductId(id);

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
        const translateProductTitleInDb = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_" + id, "en");

        if(translateProductTitleInDb) {
            await this.translateServiceDb.updateTranslateByKeyAndIsoCode("product_translate_" + id, product.translate, product.translate_language);
        } else if(!translateProductTitleInDb && product.translate && product.translate.length) {
            await this.translateServiceDb.saveTranslate("product_translate_" + id, product.translate, product.translate_language);
        }
        const translateProductDescriptionInDb = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_description_" + id, product.translate_language);

        if(translateProductDescriptionInDb) {
            await this.translateServiceDb.updateTranslateByKeyAndIsoCode("product_translate_description_" + id, product.translate_description, product.translate_language_description);
        } else if(!translateProductDescriptionInDb && product.translate_description && product.translate_description.length) {
            await this.translateServiceDb.saveTranslate("product_translate_description_" + id, product.translate_description, product.translate_language_description);
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
           images: [...productAndImages.productsImages].map((el) => el.file_name)
       }
    }

    async deleteProductById(id: number) {
        const productAndImages = await this.productsServiceDb.getProductAndImagesById(id);

        if(productAndImages && productAndImages.productsImages.length) {
            await this.deleteProductImages(productAndImages.productsImages);
            await this.productsImagesServiceDb.deleteProductImagesByProductId(id);
            await this.ordersServiceDb.deleteOrdersByProductId(id);
            await this.productsServiceDb.deleteProductById(id);
            await this.calculateNumsProductsAfterDeleteProduct(productAndImages.num);
        } else {
            throw new NotFoundException();
        }
    }

    async calculateNumsProductsAfterDeleteProduct(numDeleteProduct: number) {
        let numDeleteProductIncremented = numDeleteProduct;
        const productsCountAfterNum = await this.productsServiceDb.getCountProductsBiggerNum(numDeleteProduct);

        if(productsCountAfterNum > 0) {
            for(let i = 0; i < productsCountAfterNum; i++) {
                await this.productsServiceDb.updateProductsNumToPrev(numDeleteProductIncremented);
                numDeleteProductIncremented += 1;
            }
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
