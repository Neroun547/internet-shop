import {
    Body,
    Controller,
    Delete, ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    Patch, Post,
    Query, Req,
    Res,
    UseFilters,
    UseGuards
} from "@nestjs/common";
import { Response, Request } from "express";
import {OrdersService} from "./service/orders.service";
import {AuthGuard} from "../auth/guards/auth.guard";
import {ChangeStatusDto} from "./dto/change-status.dto";
import {AddAdminNoteDto} from "./dto/add-admin-note.dto";
import { OrdersServiceDb } from "../../../db/orders/orders.service";
import { UsersServiceDb } from "../../../db/users/users.service";
import { ORDERS_STEP } from "./constants";

@Controller()
export class OrdersController {
    constructor(
      private ordersService: OrdersService,
      private ordersServiceDb: OrdersServiceDb,
      private usersServiceDb: UsersServiceDb
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    async getOrdersPage(@Req() req: Request) {
        const orders = await this.ordersService.getOrdersByUserId(ORDERS_STEP, 0, req["user"].id);

        const countOrders = await this.ordersServiceDb.getCountOrdersByStatusAndUserId("", req["user"].id);

        return { orders: orders, countOrders: countOrders };
    }

    @UseGuards(AuthGuard)
    @Get("load-more")
    async loadMoreOrders(
        @Req() req: Request,
        @Query("take", new ParseIntPipe()) take: number,
        @Query("skip", new ParseIntPipe()) skip: number,
        @Query("status") status: string
    ) {
        if(status && status === "not_completed") {
            return {
                orders: await this.ordersService.getOrdersByStatusAndByUserId(take, skip, null, req["user"].id),
                countOrders: await this.ordersServiceDb.getCountOrdersByStatusAndUserId("not_completed", req["user"].id)
            };
        }
        if(status && status !== "not_completed") {
            return {
                orders: await this.ordersService.getOrdersByStatusAndByUserId(take, skip, status, req["user"].id),
                countOrders: await this.ordersServiceDb.getCountOrdersByStatusAndUserId(status, req["user"].id)
            };
        }
        return { orders: await this.ordersService.getOrdersByUserId(take, skip, req["user"].id), countOrders: await this.ordersServiceDb.getCountOrdersByStatusAndUserId("", req["user"].id) };
    }

    @UseGuards(AuthGuard)
    @Get(":idOrder")
    async getOrderPage(@Req() req: Request, @Param("idOrder") idOrder: string) {
        const order = await this.ordersService.getOrderAndProductByOrderIdAndUserId(idOrder, req["user"].id);

        return {
            products: order.order.map(el => ({ ...el.product, count: el.count })),
            all_sum: order.all_sum,
            contact_info: order.contact_info,
            complete: order.complete,
            remark: order.remark,
            status: order.status,
            first_name: order.first_name,
            last_name: order.last_name,
            admin_note: order.admin_note,
            partner: req["user"].role === "partner",
            created_at: order.created_at
        };
    }

    @UseGuards(AuthGuard)
    @Patch("/change-status/:idOrder")
    async changeStatusOrderByOrderId(@Req() req: Request, @Param("idOrder") idOrder: string, @Body() body: ChangeStatusDto) {
        await this.ordersService.changeStatusByOrderIdAndUserId(idOrder, body.status, req["user"].id);

        return;
    }

    @UseGuards(AuthGuard)
    @Delete(":idOrder")
    async deleteOrderByOrderId(@Req() req: Request, @Param("idOrder") idOrder: string) {
        const user = await this.usersServiceDb.getUserById(req["user"].id);

        if(user.role === "admin") {
            await this.ordersService.deleteOrderByOrderId(idOrder);

            return;
        }
        throw new ForbiddenException();
    }

    @UseGuards(AuthGuard)
    @Delete("/status/:idOrder")
    async deleteStatusOrderByOrderId(@Param("idOrder") idOrder: string) {
        await this.ordersService.deleteStatusByOrderId(idOrder);

        return;
    }

    @UseGuards(AuthGuard)
    @Post("/add-admin-note/:id")
    async addAdminNote(@Body() body: AddAdminNoteDto, @Param("id") id: string) {
        await this.ordersService.addAdminNote(id, body.note);

        return;
    }
}
