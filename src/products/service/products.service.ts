import { Injectable } from "@nestjs/common";
import { ProductsServiceDb } from "../../../db/products/products.service";
import { translateTypeProduct } from "../../../constants";
import { UsersServiceDb } from "../../../db/users/users.service";
import { RubricsTypesServiceDb } from "../../../db/rubrics-types/rubrics-types.service";
import { RubricsServiceDb } from "../../../db/rubrics/rubrics.service";
import { TranslateServiceDb } from "../../../db/translate/translate.service";

@Injectable()
export class ProductsService {
    constructor(
        private productsServiceDb: ProductsServiceDb,
        private usersServiceDb: UsersServiceDb,
        private rubricsTypesServiceDb: RubricsTypesServiceDb,
        private rubricsServiceDb: RubricsServiceDb,
        private translateServiceDb: TranslateServiceDb
    ) {}

    async parseProductsForLoadCards(productsAndImages) {
        const parseArr = [];

        for(let i = 0; i < productsAndImages.length; i++) {
            if(productsAndImages[i]) {
                parseArr.push({
                    ...productsAndImages[i],
                    file_name: productsAndImages[i].productsImages[0] ? productsAndImages[i].productsImages[0].file_name : null,
                    partner: (await this.usersServiceDb.getUserById(productsAndImages[i].user_id)).role === "partner"
                });
            }
        }
        return parseArr;
    }

    async getProductsByType(take: number, skip: number, type?: string, rubricId?: any, searchName?: string) {
        if(!type) {
            if(!isNaN(Number(rubricId)) && Number(rubricId) !== 0) {
                return await this.productsServiceDb.getProductsAndImagesByRubricId(Number(rubricId), take, skip, searchName);
            } else {
                return await this.productsServiceDb.getProductsAndImages(take, skip, searchName);
            }
        }
        if(!isNaN(Number(type))) {
            const productType = await this.rubricsTypesServiceDb.getTypeById(Number(type));
            return await this.productsServiceDb.getProductsAndImagesByType(take, skip, productType.name, searchName);
        }
        if(type) {
            return await this.productsServiceDb.getProductsAndImagesByType(take, skip, translateTypeProduct[type], searchName);
        }
    }

    async getProductsLikeName(take: number, skip: number, name: string) {
        return await this.productsServiceDb.getProductsAndImagesLikeName(take, skip, name);
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
        if(!isNaN(Number(type))) {
            const productType = await this.rubricsTypesServiceDb.getTypeById(Number(type));

            return await this.productsServiceDb.getMaxPriceProductsByType(productType.name);
        }
        return await this.productsServiceDb.getMaxPriceProductsByType(translateTypeProduct[type]);
    }

    async getMinPriceProductsByType(type: string) {
        if(!isNaN(Number(type))) {
            const productType = await this.rubricsTypesServiceDb.getTypeById(Number(type));

            return await this.productsServiceDb.getMinPriceProductsByType(productType.name);
        }
        return await this.productsServiceDb.getMinPriceProductsByType(translateTypeProduct[type]);
    }

    async getMaxPriceProducts() {
        return await this.productsServiceDb.getMaxPriceProducts();
    }

    async getMinPriceProducts() {
        return await this.productsServiceDb.getMinPriceProducts();
    }

    async getMaxProductPriceLikeName(name: string) {
        return await this.productsServiceDb.getMaxPriceProductsLikeName(name);
    }

    async getMinProductsPriceLikeName(name: string) {
        return await this.productsServiceDb.getMinPriceProductsLikeName(name);
    }

    async getProductsByFilters(take: number, skip: number, available: string, priceFrom: number, priceTo: number, type: string, rubricId?: any, searchName?: string) {
        let productType: string;

        if(type === "all") {
            productType = "";
        } else if(isNaN(Number(type))) {
            productType = translateTypeProduct[type];
        } else {
            const typeInDb = await this.rubricsTypesServiceDb.getTypeById(Number(type));

            if(typeInDb) {
                productType = typeInDb.name
            }
        }

        if(!isNaN(Number(rubricId)) && Number(rubricId) !== 0) {
            if(available === "all") {
                return await this.productsServiceDb.getProductsAndImagesByFiltersAndRubricId(take, skip, priceFrom, priceTo, productType, undefined, Number(rubricId), searchName);
            }
            if(available === "not_available") {
                return await this.productsServiceDb.getProductsAndImagesByFiltersAndRubricId(take, skip, priceFrom, priceTo, productType, false, Number(rubricId), searchName);
            }
            if(available === "available") {
                return await this.productsServiceDb.getProductsAndImagesByFiltersAndRubricId(take, skip, priceFrom, priceTo, productType, true, Number(rubricId), searchName);
            }
        } else {
            if(available === "all") {
                return await this.productsServiceDb.getProductsAndImagesByFilters(take, skip, priceFrom, priceTo, productType, undefined, searchName);
            }
            if(available === "not_available") {
                return await this.productsServiceDb.getProductsAndImagesByFilters(take, skip, priceFrom, priceTo, productType, false, searchName);
            }
            if(available === "available") {
                return await this.productsServiceDb.getProductsAndImagesByFilters(take, skip, priceFrom, priceTo, productType, true, searchName);
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
    async getParseProductsWithTranslate(language: string, products) {

        if(language === "en") {
            return await Promise.all((await this.parseProductsForLoadCards(products))
              .map(async product => {
                  const translateTitle = (await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_" + product.id, "en"));

                  return {
                      ...product,
                      translateTitle: translateTitle ? translateTitle.value : ""
                  }
              }));
        } else {
            return await this.parseProductsForLoadCards(products);
        }
    }

    async getProductsAndImages(take: number, skip: number) {
        return await this.productsServiceDb.getProductsAndImages(take, skip);
    }
}
