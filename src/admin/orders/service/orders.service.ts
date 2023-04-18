import { Injectable } from "@nestjs/common";
import {OrdersServiceDb} from "../../../../db/orders/orders.service";
import {Orders} from "../../../../db/orders/orders.entity";
const Moment = require("moment");

@Injectable()
export class OrdersService {
    constructor(private ordersServiceDb: OrdersServiceDb) {}

    async getOrders(take: number, skip: number) {
        return this.parseOrders(await this.ordersServiceDb.getOrders(take, skip));
    }

    async getOrderAndProductByOrderId(orderId: string) {
        return this.parseOrder(await this.ordersServiceDb.getOrderAndProductByOrderId(orderId));
    }

    async setOrderCompleteTrueByOrderId(idOrder: string) {
        await this.ordersServiceDb.setOrderCompleteTrueByOrderId(idOrder);
    }

    async deleteOrderByOrderId(idOrder: string) {
        await this.ordersServiceDb.deleteOrderByOrderId(idOrder);
    }

    parseOrders(arr: Array<Orders>) {
        const result = [];

        for(let i = 0; i < arr.length; i++) {
            if(!result.find((el) => el.id_order === arr[i].id_order)) {
                result.push({...arr[i], created_at: new Moment(arr[i].created_at).format("LLLL") });
            }
        }
        return result;
    }

    parseOrder(arr: any) {
        const result = { order: arr, all_sum: 0, contact_info: arr[0].contact_info, complete: arr[0].complete };

        for(let i = 0; i < arr.length; i++) {
            result.all_sum += arr[i].product.price * arr[i].count
        }
        return result;
    }
}
