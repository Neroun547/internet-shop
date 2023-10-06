import { BadRequestException, Body, Controller, Post, Req, Res } from "@nestjs/common";
import {BuyService} from "./service/buy.service";
import {AddOrderDto} from "./dto/add-order.dto";
import { Response, Request } from "express";
import { TranslateService } from "../translate/service/translate.service";

@Controller()
export class BuyController {
    constructor(private buyService: BuyService, private translateService: TranslateService) {}

    @Post()
    async addOrder(@Body() body: AddOrderDto, @Req() req: Request, @Res() res: Response) {
        const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("buy_page", req.cookies["iso_code_shop"]);

        if(!body.contact_info.trim().length) {
            throw new BadRequestException();
        }
        await this.buyService.addOrder(body);

        res.cookie("basket_in_shop", "");
        res.send(translate);
    }
}
