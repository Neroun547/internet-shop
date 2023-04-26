import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Orders} from "./orders.entity";
import {EntityManager, EntityRepository} from "@mikro-orm/mysql";
import {OrdersInterface} from "./interfaces/orders.interface";

@Injectable()
export class OrdersServiceDb {
    constructor(
        @InjectRepository(Orders) private repository: EntityRepository<Orders>,
        private em: EntityManager
        ) {}

    async saveOrder(order: OrdersInterface) {
        const orderModel = new Orders;

        orderModel.product = order.product;
        orderModel.count = order.count;
        orderModel.contact_info = order.contact_info;
        orderModel.id_order = order.id_order;
        orderModel.remark = order.remark;
        orderModel.status = order.status;

        await this.repository.persistAndFlush(orderModel);
    }

    async getOrders(take: number, skip: number) {
        return await this.em.execute("SELECT DISTINCT id_order, created_at, status FROM orders LIMIT ? OFFSET ?",
            [take, skip]);
    }

    async getOrdersByStatus(take: number, skip: number, status: string | null) {
        if(status === null) {
            return await this.em.execute("SELECT DISTINCT id_order, created_at, status FROM orders WHERE status IS NULL LIMIT ? OFFSET ?",
                [take, skip]);
        } else {
            return await this.em.execute("SELECT DISTINCT id_order, created_at, status FROM orders WHERE status = ? LIMIT ? OFFSET ?",
                [status, take, skip]);
        }
    }

    async getOrderAndProductByOrderId(orderId: string) {
        return await this.repository.find({ id_order: orderId }, { populate: ["product"] })
    }


    async deleteOrderByOrderId(orderId: string) {
        await this.repository.nativeDelete({ id_order: orderId });
    }

    async deleteOrdersByProductId(productId: number) {
        await this.repository.nativeDelete({ product: productId });
    }

    async changeStatusByOrderId(orderId: string, status: string) {
        await this.repository.nativeUpdate({ id_order: orderId }, { status: status });
    }
    async deleteStatusByOrderId(orderId: string) {
        await this.repository.nativeUpdate({ id_order: orderId }, { status: null });
    }
}
