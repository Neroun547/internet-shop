import { Controller, Get, Param, ParseFloatPipe, ParseIntPipe, Query, Req, Res } from "@nestjs/common";
import { ProductsService } from "./service/products.service";
import { Request } from "express";
import { PRODUCTS_STEP } from "./constants";

@Controller()
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ) {}

    @Get()
    async getProducts(
      @Req() req: Request
    ) {
        const productsAndImages = await this.productsService.getProductsAndImages(PRODUCTS_STEP, 0);

        return await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], productsAndImages);
    }

    @Get("by-filters")
    async getProductsByFilters(
        @Query("available") available: string,
        @Query("priceFrom", new ParseFloatPipe()) priceFrom: number,
        @Query("priceTo", new ParseFloatPipe()) priceTo: number,
        @Query("type") type: string,
        @Query("rubricId") rubricId,
        @Query("searchName") searchName: string,
        @Req() req: Request
    ) {
        const productsAndImages = await this.productsService.getProductsByFilters(PRODUCTS_STEP, 0, available, priceFrom, priceTo, type, rubricId, searchName);

        if(req.cookies["iso_code_shop"] === "en") {
            return await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], productsAndImages);
        } else {
            return await this.productsService.parseProductsForLoadCards(productsAndImages);
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
        @Query("rubricId") rubricId: number,
        @Query("name") name: string,
        @Req() req: Request) {

        if(available && priceFrom && priceTo) {
            const productsAndImages = await this.productsService.getProductsByFilters(take, skip, available, Number(priceFrom), Number(priceTo), type, rubricId, name);

            return await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], productsAndImages);
        } else {
            const productsAndImages = await this.productsService.getProductsByType(take, skip, type, rubricId, name);

            return await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], productsAndImages);
        }
    }

    @Get("by-type/:type")
    async getProductsByType(@Param("type") type: string, @Req() req: Request) {
        const products = await this.productsService.getProductsByType(PRODUCTS_STEP, 0, type, req.cookies["iso_code_shop"]);

        const maxProductsPrice = await this.productsService.getMaxPriceProductsByType(type);
        const minProductsPrice = await this.productsService.getMinPriceProductsByType(type);

        return {
            products: await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], products),
            minPrice: minProductsPrice,
            maxPrice: maxProductsPrice
        }
    }

    @Get("by-rubrics/:id")
    async getProductsPageByRubric(@Req() req: Request, @Param("id", new ParseIntPipe()) rubricId: number) {
        let products;

        if(rubricId === 0) {
            products = await this.productsService.getProductsByType(PRODUCTS_STEP, 0, "", req.cookies["iso_code_shop"]);
        } else {
            products = await this.productsService.getProductsByRubricId(rubricId, PRODUCTS_STEP, 0);
        }
        const maxProductsPrice = await this.productsService.getMaxProductsPriceByRubricId(rubricId);
        const minProductsPrice = await this.productsService.getMinProductsPriceByRubricId(rubricId);

        return {
            products: await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], products),
            maxPrice: maxProductsPrice,
            minPrice: minProductsPrice
        }
    }

    @Get("by-name")
    async getProductsLikeName(@Query("name") name: string, @Req() req: Request) {
        const products = await this.productsService.getProductsLikeName(PRODUCTS_STEP, 0, name);
        const maxProductsPrice = await this.productsService.getMaxProductPriceLikeName(name);
        const minProductsPrice = await this.productsService.getMinProductsPriceLikeName(name);

        return {
            products: await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], products),
            maxPrice: maxProductsPrice,
            minPrice: minProductsPrice
        };
    }

    @Get(":id")
    async getProductById(@Param("id", new ParseIntPipe()) id: number) {
        return await this.productsService.getProductAndImageByProductId(id);
    }
}
