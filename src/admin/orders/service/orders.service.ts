import { Injectable } from "@nestjs/common";
import {OrdersServiceDb} from "../../../../db/orders/orders.service";
const Moment = require("moment");

Moment.locale("uk");

@Injectable()
export class OrdersService {
    constructor(private ordersServiceDb: OrdersServiceDb) {}

    async getOrders(take: number, skip: number) {
        return this.parseOrders(await this.ordersServiceDb.getOrders(take, skip));
    }

    async getOrdersByStatus(take: number, skip: number, status: string | null) {
        return this.parseOrders(await this.ordersServiceDb.getOrdersByStatus(take, skip, status));
    }

    async getOrderAndProductByOrderId(orderId: string) {
        return this.parseOrder(await this.ordersServiceDb.getOrderAndProductByOrderId(orderId));
    }

    async deleteOrderByOrderId(idOrder: string) {
        await this.ordersServiceDb.deleteOrderByOrderId(idOrder);
    }

    async changeStatusByOrderId(idOrder: string, status: string) {
        await this.ordersServiceDb.changeStatusByOrderId(idOrder, status);
    }

    async deleteStatusByOrderId(idOrder: string) {
        await this.ordersServiceDb.deleteStatusByOrderId(idOrder);
    }

    parseOrders(arr) {
        const result = [];

        for(let i = 0; i < arr.length; i++) {
            result.push({...arr[i], created_at: new Moment(arr[i].created_at).format("LLLL") });
        }
        return result;
    }

    parseOrder(arr) {
        const result = {
            order: arr,
            all_sum: 0,
            contact_info: arr[0].contact_info,
            complete: arr[0].complete,
            remark: arr[0].remark,
            status: arr[0].status,
            first_name: arr[0].first_name,
            last_name: arr[0].last_name
        };

        for(let i = 0; i < arr.length; i++) {
            result.all_sum += arr[i].product.price * arr[i].count
        }
        return result;
    }
}
