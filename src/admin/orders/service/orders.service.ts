import { Injectable } from "@nestjs/common";
import {OrdersServiceDb} from "../../../../db/orders/orders.service";
const Moment = require("moment");

Moment.locale("uk");

@Injectable()
export class OrdersService {
    constructor(private ordersServiceDb: OrdersServiceDb) {}

    async getOrdersByUserId(take: number, skip: number, userId: number) {
        return await this.parseOrders(await this.ordersServiceDb.getOrdersByUserId(take, skip, userId), userId);
    }

    async getOrdersByStatusAndByUserId(take: number, skip: number, status: string | null, userId: number) {
        return await this.parseOrders(await this.ordersServiceDb.getOrdersByStatusAndUserId(take, skip, status, userId), userId);
    }

    async getOrderAndProductByOrderIdAndUserId(orderId: string, userId: number) {
        return this.parseOrder(await this.ordersServiceDb.getOrderAndProductByOrderIdAndUserId(orderId, userId));
    }

    async deleteOrderByOrderId(idOrder: string) {
        await this.ordersServiceDb.deleteOrderByOrderId(idOrder);
    }

    async changeStatusByOrderIdAndUserId(idOrder: string, status: string, userId: number) {
        await this.ordersServiceDb.changeStatusByOrderIdAndUserId(idOrder, status, userId);
    }

    async deleteStatusByOrderId(idOrder: string) {
        await this.ordersServiceDb.deleteStatusByOrderId(idOrder);
    }

    async addAdminNote(id: string, note: string) {
        await this.ordersServiceDb.addAdminNoteByIdOrder(id, note);
    }

    async parseOrders(arr, userId: number) {
        const result = [];

        for(let i = 0; i < arr.length; i++) {
            const ordersAndProducts = (await this.ordersServiceDb.geOrdersAndProductsByOrderIdAndUserId(arr[i].id_order, userId));
            const setOfProductsNames = new Set();

            for(let i = 0; i < ordersAndProducts.length; i++) {
                if(setOfProductsNames.size < 5) {
                    setOfProductsNames.add(ordersAndProducts[i].product.name);
                } else {
                    setOfProductsNames.add("...");

                    break;
                }
            }
            result.push({
                ...arr[i],
                created_at: new Moment(arr[i].created_at).format("LLLL"),
                productsList: Array.from(setOfProductsNames)
            });
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
            last_name: arr[0].last_name,
            admin_note: arr[0].admin_note
        };

        for(let i = 0; i < arr.length; i++) {
            result.all_sum += arr[i].product.price * arr[i].count
        }
        return result;
    }
}
