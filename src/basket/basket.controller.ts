import {Controller, Delete, Get, Param, ParseIntPipe, Post, Req, Res} from "@nestjs/common";
import { Response, Request } from "express";
import {BasketService} from "./service/basket.service";

@Controller()
export class BasketController {
    constructor(private basketService: BasketService) {}

    @Get()
    async getBasketPage(@Req() req: Request, @Res() res: Response) {
        const parseData = await this.basketService.getBasketProducts(req.cookies["basket_in_shop"]);

        if(parseData) {
            res.render("basket/basket", {
                products: parseData.data,
                styles: ["/css/basket/basket.css", "/css/buy/buy.css"],
                scripts: ["/js/basket/basket.js", "/js/buy/buy.js"],
                sum: parseData.sum.toFixed(2)
            });
        } else {
            res.render("basket/basket", {
                products: false,
                styles: ["/css/basket/basket.css"]
            });
        }
    }

    @Post(":id")
    async addItemInBasket(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
        const basket = req.cookies["basket_in_shop"];

        if(typeof basket === "string") {
            const itemInCookie = this.basketService.parseProductsCookie(basket).find(el => el === id)

            if(!itemInCookie) {
                res.cookie("basket_in_shop", basket + "," + id);
            }
        } else {
            res.cookie("basket_in_shop", id);
        }
        res.sendStatus(200);
    }

    @Delete(":id")
    deleteProductFromBasket(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
        const parseCookie = this.basketService.parseProductsCookie(req.cookies["basket_in_shop"]);
        const indexDeleteElement = parseCookie.findIndex(el => el === id);

        if(indexDeleteElement !== -1) {
            parseCookie.splice(indexDeleteElement, 1);
            res.cookie("basket_in_shop", parseCookie.join(","));
        }
        res.sendStatus(204)
    }
}
