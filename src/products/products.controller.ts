import {Controller, Get, Param, ParseFloatPipe, ParseIntPipe, Query, Req, Res} from "@nestjs/common";
import {ProductsService} from "./service/products.service";
import {Request, Response} from "express";
import {BasketService} from "../basket/service/basket.service";
import { TranslateService } from "../translate/service/translate.service";
import { TranslateServiceDb } from "../../db/translate/translate.service";
import { RubricsTypesServiceDb } from "../../db/rubrics-types/rubrics-types.service";

@Controller()
export class ProductsController {
    constructor(
        private productsService: ProductsService,
        private basketService: BasketService,
        private translateService: TranslateService,
        private translateServiceDb: TranslateServiceDb,
        private rubricsTypesServiceDb: RubricsTypesServiceDb
    ) {}

    @Get("by-filters")
    async getProductsByFilters(
        @Query("available") available: string,
        @Query("priceFrom", new ParseFloatPipe()) priceFrom: number,
        @Query("priceTo", new ParseFloatPipe()) priceTo: number,
        @Query("type") type: string,
        @Query("rubricId") rubricId,
        @Req() req: Request
    ) {
        const productsAndImages = await this.productsService.getProductsByFilters(8, 0, available, priceFrom, priceTo, type, rubricId);

        if(req.cookies["iso_code_shop"] === "en") {
            return await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], req.cookies["basket_in_shop"], productsAndImages);
        } else {
            return await this.productsService.parseProductsForLoadCards(productsAndImages, req.cookies["basket_in_shop"]);
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
        @Query("rubricId") rubricId,
        @Req() req: Request) {

        if(available && priceFrom && priceTo) {
            const productsAndImages = await this.productsService.getProductsByFilters(take, skip, available, Number(priceFrom), Number(priceTo), type, rubricId);

            return await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], req.cookies["basket_in_shop"], productsAndImages);
        } else {
            const productsAndImages = await this.productsService.getProductsByType(take, skip, type, rubricId);

            return await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], req.cookies["basket_in_shop"], productsAndImages);
        }
    }

    @Get("by-type/:type")
    async getProductsByType(@Param("type") type, @Query("rubricId") rubricId, @Req() req: Request, @Res() res: Response) {
        const products = await this.productsService.getProductsByType(8, 0, type, req.cookies["iso_code_shop"]);

        const maxProductsPrice = await this.productsService.getMaxPriceProductsByType(type);
        const minProductsPrice = await this.productsService.getMinPriceProductsByType(type);

        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("products_page", req.cookies["iso_code_shop"]);

        if(!products.length) {
            res.render("root", {
                products: false,
                styles: ["/css/root.css"],
                scripts: ["/js/root.js"],
                activeLanguage: req.cookies["iso_code_shop"],
                ...translate,
                rubrics: await this.productsService.getParseRubricsForPage(rubricId),
                filtersMenuItems: await this.rubricsTypesServiceDb.getTypesByRubricId(rubricId),
                rubric_id: rubricId
            });
        } else {
            res.render("root", {
                products: await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], req.cookies["basket_in_shop"], products),
                styles: ["/css/root.css"],
                scripts: ["/js/root.js"],
                type: type,
                maxProductsPrice: maxProductsPrice,
                minProductsPrice: minProductsPrice,
                activeLanguage: req.cookies["iso_code_shop"],
                ...translate,
                rubrics: await this.productsService.getParseRubricsForPage(rubricId),
                filtersMenuItems: await this.rubricsTypesServiceDb.getTypesByRubricId(rubricId),
                rubric_id: rubricId
            });
        }
    }

    @Get("by-rubrics/:id")
    async getProductsPageByRubric(@Req() req: Request, @Param("id", new ParseIntPipe()) rubricId: number, @Res() res: Response) {
        let products;

        if(rubricId === 0) {
            products = await this.productsService.getProductsByType(8, 0, "", req.cookies["iso_code_shop"]);
        } else {
            products = await this.productsService.getProductsByRubricId(rubricId, 8, 0);
        }
        const maxProductsPrice = await this.productsService.getMaxProductsPriceByRubricId(rubricId);
        const minProductsPrice = await this.productsService.getMinProductsPriceByRubricId(rubricId);

        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("products_page", req.cookies["iso_code_shop"]);

        res.render("root", {
            products: await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], req.cookies["basket_in_shop"], products),
            styles: ["/css/root.css"],
            scripts: ["/js/root.js"],
            maxProductsPrice: maxProductsPrice,
            minProductsPrice: minProductsPrice,
            activeLanguage: req.cookies["iso_code_shop"],
            ...translate,
            filtersMenuItems: await this.rubricsTypesServiceDb.getTypesByRubricId(rubricId),
            rubric_id: rubricId,
            rubrics: await this.productsService.getParseRubricsForPage(rubricId)
        });
    }

    @Get(":id")
    async getProductById(@Param("id", new ParseIntPipe()) id, @Req() req: Request, @Res() res: Response) {
        const productData = await this.productsService.getProductAndImageByProductId(id);
        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("product_page", req.cookies["iso_code_shop"]);

        let translateDescription;

        if(req.cookies["iso_code_shop"] === "en") {
            translateDescription = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_description_" + id, "en");
        }
        if(req.cookies["basket_in_shop"]) {
            const inBasket = this.basketService.parseProductsCookie(req.cookies["basket_in_shop"]).find(el => el === String(productData.id));

            res.render("products/product", {
                styles: ["/css/products/product.css", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"],
                scripts: ["/js/products/product.js"],
                headScripts: ["https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"],
                inBasket: !!inBasket,
                activeLanguage: req.cookies["iso_code_shop"],
                ...productData,
                ...translate,
                translateDescription: translateDescription ? translateDescription.value : "",
                moreThenOneImage: productData.images.length > 1
            });
        } else {
            res.render("products/product", {
                styles: ["/css/products/product.css", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"],
                scripts: ["/js/products/product.js"],
                headScripts: ["https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"],
                inBasket: false,
                activeLanguage: req.cookies["iso_code_shop"],
                ...productData,
                ...translate,
                translateDescription: translateDescription ? translateDescription.value : "",
                moreThenOneImage: productData.images.length > 1
            });
        }
    }
}
