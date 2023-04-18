import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Orders} from "./orders.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {OrdersInterface} from "./interfaces/orders.interface";

@Injectable()
export class OrdersServiceDb {
    constructor(@InjectRepository(Orders) private repository: EntityRepository<Orders>) {}

    async saveOrder(order: OrdersInterface) {
        const orderModel = new Orders;

        orderModel.product = order.product;
        orderModel.complete = order.complete;
        orderModel.count = order.count;
        orderModel.contact_info = order.contact_info;
        orderModel.id_order = order.id_order;

        await this.repository.persistAndFlush(orderModel);
    }

    async getOrders(take: number, skip: number) {
        return await this.repository.find({  }, { offset: skip, limit: take, orderBy: { created_at: "DESC" } })
    }

    async getOrderAndProductByOrderId(orderId: string) {
        return await this.repository.find({ id_order: orderId }, { populate: ["product"] })
    }

    async setOrderCompleteTrueByOrderId(orderId: string) {
        await this.repository.nativeUpdate({ id_order: orderId }, { complete: true });
    }

    async deleteOrderByOrderId(orderId: string) {
        await this.repository.nativeDelete({ id_order: orderId });
    }

    async deleteOrdersByProductId(productId: number) {
        await this.repository.nativeDelete({ product: productId });
    }
}
