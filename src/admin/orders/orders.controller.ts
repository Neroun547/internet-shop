import {Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, Res, UseGuards} from "@nestjs/common";
import { Response } from "express";
import {OrdersService} from "./service/orders.service";
import {AuthGuard} from "../auth/guards/auth.guard";

@Controller()
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @UseGuards(AuthGuard)
    @Get()
    async getOrdersPage(@Res() res: Response) {
        let orders = await this.ordersService.getOrders(10, 0);

        if(orders.length) {

            res.render("admin/orders/orders", {
                orders: orders,
                auth: true,
                admin: true,
                styles: ["/css/admin/orders/orders.css"],
                scripts: ["/js/admin/orders/load-more-orders.js"]
            });
        } else {
            res.render("admin/orders/orders", {
                orders: false,
                auth: true,
                admin: true,
                styles: ["/css/admin/orders/orders.css"]
            });
        }
    }

    @UseGuards(AuthGuard)
    @Get("load-more")
    async loadMoreOrders(@Query("take", new ParseIntPipe()) take: number, @Query("skip", new ParseIntPipe()) skip: number) {
        return await this.ordersService.getOrders(take, skip);
    }

    @UseGuards(AuthGuard)
    @Get(":idOrder")
    async getProductPage(@Param("idOrder") idOrder: string, @Res() res: Response) {
        const order = await this.ordersService.getOrderAndProductByOrderId(idOrder);

        res.render("admin/orders/order", {
            auth: true,
            admin: true,
            order: order.order,
            all_sum: order.all_sum,
            contact_info: order.contact_info,
            idOrder: idOrder,
            complete: order.complete,
            styles: ["/css/admin/orders/order.css"],
            scripts: ["/js/admin/orders/order.js"]
        });
    }

    @UseGuards(AuthGuard)
    @Patch(":idOrder")
    async setOrderCompleteTrueByOrderId(@Param("idOrder") idOrder: string) {
        await this.ordersService.setOrderCompleteTrueByOrderId(idOrder);

        return;
    }

    @UseGuards(AuthGuard)
    @Delete(":idOrder")
    async deleteOrderByOrderId(@Param("idOrder") idOrder: string) {
        await this.ordersService.deleteOrderByOrderId(idOrder);

        return;
    }
}
