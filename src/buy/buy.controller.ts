import {BadRequestException, Body, Controller, Post, Res} from "@nestjs/common";
import {BuyService} from "./service/buy.service";
import {AddOrderDto} from "./dto/add-order.dto";
import { Response } from "express";

@Controller()
export class BuyController {
    constructor(private buyService: BuyService) {}

    @Post()
    async addOrder(@Body() body: AddOrderDto, @Res() res: Response) {

        if(!body.contact_info.trim().length) {
            throw new BadRequestException();
        }
        await this.buyService.addOrder(body);

        res.cookie("basket_in_shop", "");
        res.sendStatus(200);
    }
}
