import {Controller, Get, Param, ParseIntPipe, Query, Req, Res} from "@nestjs/common";
import {ProductsService} from "./service/products.service";
import { Request, Response } from "express";
import {BasketService} from "../basket/service/basket.service";

@Controller()
export class ProductsController {
    constructor(
        private productsService: ProductsService,
        private basketService: BasketService
    ) {}

    @Get("load-more")
    async loadMoreProducts(
        @Query("take", new ParseIntPipe()) take: number,
        @Query("skip", new ParseIntPipe()) skip: number,
        @Query("type") type: string,
        @Req() req: Request,
        @Res() res: Response) {

        const productsAndImages = await this.productsService.getProductsByType(take, skip, type);
        const parseData = this.productsService.parseProductsForLoadCards(productsAndImages, req.cookies["basket_in_shop"]);

        res.send(parseData);
    }

    @Get("by-type/:type")
    async getProductsByType(@Param("type") type: string, @Req() req: Request, @Res() res: Response) {
        const products = await this.productsService.getProductsByType(8, 0, type);
        const parseProducts = this.productsService.parseProductsForLoadCards(products, req.cookies["basket_in_shop"]);

        if(!products.length) {
            res.render("root", {
                products: false,
                styles: ["/css/root.css"],
                scripts: ["/js/root.js"]
            });
        } else {
            res.render("root", {
                products: parseProducts,
                styles: ["/css/root.css"],
                scripts: ["/js/root.js", "/js/load-more-products.js"],
                type: type
            });
        }
    }

    @Get(":id")
    async getProductById(@Param("id", new ParseIntPipe()) id, @Req() req: Request, @Res() res: Response) {
        const productData = await this.productsService.getProductAndImageByProductId(id);

        if(req.cookies["basket_in_shop"]) {
            const inBasket = this.basketService.parseProductsCookie(req.cookies["basket_in_shop"]).find(el => el === String(productData.id));

            res.render("products/product", {
                styles: ["/css/products/product.css"],
                scripts: ["/js/products/product.js"],
                inBasket: inBasket ? true : false,
                ...productData
            });
        } else {
            res.render("products/product", {
                styles: ["/css/products/product.css"],
                scripts: ["/js/products/product.js"],
                inBasket: false,
                ...productData
            });
        }
    }
}
