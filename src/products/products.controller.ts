import {Controller, Get, Param, ParseFloatPipe, ParseIntPipe, Query, Req, Res} from "@nestjs/common";
import {ProductsService} from "./service/products.service";
import {Request, Response} from "express";
import {BasketService} from "../basket/service/basket.service";
import { TranslateService } from "../translate/service/translate.service";
import { TranslateServiceDb } from "../../db/translate/translate.service";

@Controller()
export class ProductsController {
    constructor(
        private productsService: ProductsService,
        private basketService: BasketService,
        private translateService: TranslateService,
        private translateServiceDb: TranslateServiceDb
    ) {}

    @Get("by-filters")
    async getProductsByFilters(
        @Query("available") available: string,
        @Query("priceFrom", new ParseFloatPipe()) priceFrom: number,
        @Query("priceTo", new ParseFloatPipe()) priceTo: number,
        @Query("type") type: string,
        @Req() req: Request
    ) {
        const productsAndImages = await this.productsService.getProductsByFilters(8, 0, available, priceFrom, priceTo, type);

        if(req.cookies["iso_code_shop"] === "en") {
            return await Promise.all(this.productsService.parseProductsForLoadCards(productsAndImages, req.cookies["basket_in_shop"])
              .map(async product => {
                  const translateTitle = (await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_" + product.id, "en"));

                  return {
                      ...product,
                      translateTitle: translateTitle ? translateTitle.value : ""
                  }
              }));
        } else {
            return this.productsService.parseProductsForLoadCards(productsAndImages, req.cookies["basket_in_shop"]);
        }
    }

    @Get("load-more")
    async loadMoreProducts(
        @Query("take", new ParseIntPipe()) take: number,
        @Query("skip", new ParseIntPipe()) skip: number,
        @Query("type") type: string,
        @Query("available") available: string,
        @Query("priceFrom") priceFrom: number,
        @Query("priceTo") priceTo: number,
        @Req() req: Request) {

        if(available && priceFrom && priceTo) {
            const productsAndImages = await this.productsService.getProductsByFilters(take, skip, available, Number(priceFrom), Number(priceTo), type);

            if(req.cookies["iso_code_shop"] === "en") {
                return await Promise.all(this.productsService.parseProductsForLoadCards(productsAndImages, req.cookies["basket_in_shop"])
                  .map(async product => {
                      const translateTitle = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_" + product.id, "en");

                      return {
                          ...product,
                          translateTitle: translateTitle ? translateTitle.value : ""
                      }
                  }));
            } else {
                return this.productsService.parseProductsForLoadCards(productsAndImages, req.cookies["basket_in_shop"]);
            }
        } else {
            const productsAndImages = await this.productsService.getProductsByType(take, skip, type);

            if(req.cookies["iso_code_shop"] === "en") {
                return await Promise.all(this.productsService.parseProductsForLoadCards(productsAndImages, req.cookies["basket_in_shop"])
                  .map(async product => {
                      const translateTitle = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_" + product.id, "en");

                      return {
                          ...product,
                          translateTitle: translateTitle ? translateTitle.value : ""
                      }
                  }));
            } else {
                return this.productsService.parseProductsForLoadCards(productsAndImages, req.cookies["basket_in_shop"]);
            }
        }
    }

    @Get("by-type/:type")
    async getProductsByType(@Param("type") type: string, @Req() req: Request, @Res() res: Response) {
        const products = await this.productsService.getProductsByType(8, 0, type, req.cookies["iso_code_shop"]);
        let parseProducts;

        if(req.cookies["iso_code_shop"] === "en") {
            parseProducts = await Promise.all(this.productsService.parseProductsForLoadCards(products, req.cookies["basket_in_shop"])
              .map(async product => {
                  const translateTitle = (await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_" + product.id, "en"));

                  return {
                      ...product,
                      translateTitle: translateTitle ? translateTitle.value : ""
                  }
              }));
        } else {
            parseProducts = this.productsService.parseProductsForLoadCards(products, req.cookies["basket_in_shop"]);
        }
        const maxProductsPrice = await this.productsService.getMaxPriceProductsByType(type);
        const minProductsPrice = await this.productsService.getMinPriceProductsByType(type);

        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("products_page", req.cookies["iso_code_shop"]);

        if(!products.length) {
            res.render("root", {
                products: false,
                styles: ["/css/root.css"],
                scripts: ["/js/root.js"],
                activeLanguage: req.cookies["iso_code_shop"],
                ...translate
            });
        } else {
            res.render("root", {
                products: parseProducts,
                styles: ["/css/root.css"],
                scripts: ["/js/root.js"],
                type: type,
                maxProductsPrice: maxProductsPrice,
                minProductsPrice: minProductsPrice,
                activeLanguage: req.cookies["iso_code_shop"],
                ...translate
            });
        }
    }

    @Get(":id")
    async getProductById(@Param("id", new ParseIntPipe()) id, @Req() req: Request, @Res() res: Response) {
        const productData = await this.productsService.getProductAndImageByProductId(id);
        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("product_page", req.cookies["iso_code_shop"]);

        if(req.cookies["basket_in_shop"]) {
            const inBasket = this.basketService.parseProductsCookie(req.cookies["basket_in_shop"]).find(el => el === String(productData.id));

            res.render("products/product", {
                styles: ["/css/products/product.css"],
                scripts: ["/js/products/product.js"],
                inBasket: !!inBasket,
                activeLanguage: req.cookies["iso_code_shop"],
                ...productData,
                ...translate
            });
        } else {
            res.render("products/product", {
                styles: ["/css/products/product.css"],
                scripts: ["/js/products/product.js"],
                inBasket: false,
                activeLanguage: req.cookies["iso_code_shop"],
                ...productData,
                ...translate
            });
        }
    }
}
