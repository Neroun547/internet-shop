import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch, Post,
    Query,
    Res,
    UseFilters,
    UseGuards
} from "@nestjs/common";
import { Response } from "express";
import {OrdersService} from "./service/orders.service";
import {AuthGuard} from "../auth/guards/auth.guard";
import {ChangeStatusDto} from "./dto/change-status.dto";
import {HttpExceptionFilter} from "../../../error-filters/error-filter-admin";
import {AddAdminNoteDto} from "./dto/add-admin-note.dto";

@Controller()
@UseFilters(HttpExceptionFilter)
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
                scripts: ["/js/admin/orders/orders.js", "/js/admin/orders/push-messages.main.js"]
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
    async loadMoreOrders(
        @Query("take", new ParseIntPipe()) take: number,
        @Query("skip", new ParseIntPipe()) skip: number,
        @Query("status") status: string
    ) {
        if(status && status === "not_completed") {
            return await this.ordersService.getOrdersByStatus(take, skip, null);
        }
        if(status && status !== "not_completed") {
            return await this.ordersService.getOrdersByStatus(take, skip, status);
        }
        return await this.ordersService.getOrders(take, skip);
    }

    @UseGuards(AuthGuard)
    @Get(":idOrder")
    async getOrderPage(@Param("idOrder") idOrder: string, @Res() res: Response) {
        const order = await this.ordersService.getOrderAndProductByOrderId(idOrder);

        res.render("admin/orders/order", {
            auth: true,
            admin: true,
            order: order.order,
            all_sum: order.all_sum,
            contact_info: order.contact_info,
            idOrder: idOrder,
            complete: order.complete,
            remark: order.remark,
            status: order.status,
            first_name: order.first_name,
            last_name: order.last_name,
            admin_note: order.admin_note,
            styles: ["/css/admin/orders/order.css"],
            scripts: ["/js/admin/orders/order.js"]
        });
    }

    @UseGuards(AuthGuard)
    @Patch("/change-status/:idOrder")
    async changeStatusOrderByOrderId(@Param("idOrder") idOrder: string, @Body() body: ChangeStatusDto) {
        await this.ordersService.changeStatusByOrderId(idOrder, body.status);

        return;
    }

    @UseGuards(AuthGuard)
    @Delete(":idOrder")
    async deleteOrderByOrderId(@Param("idOrder") idOrder: string) {
        await this.ordersService.deleteOrderByOrderId(idOrder);

        return;
    }

    @UseGuards(AuthGuard)
    @Delete("/status/:idOrder")
    async deleteStatusOrderByOrderId(@Param("idOrder") idOrder: string) {
        await this.ordersService.deleteStatusByOrderId(idOrder);

        return;
    }

    @UseGuards(AuthGuard)
    @Post("/add-admin-note/:id")
    async addAdminNote(@Body() body: AddAdminNoteDto, @Param("id") id: string, @Res() res: Response) {
        await this.ordersService.addAdminNote(id, body.note);

        res.redirect("/admin/orders/"+id);
    }
}
