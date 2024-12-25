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
        const orderModel = new Orders();

        orderModel.product_id = order.product_id;
        orderModel.count = order.count;
        orderModel.contact_info = order.contact_info;
        orderModel.id_order = order.id_order;
        orderModel.remark = order.remark;
        orderModel.status = order.status;
        orderModel.first_name = order.first_name;
        orderModel.last_name = order.last_name;
        orderModel.admin_note = order.admin_note;
        orderModel.user_id = order.user_id;

        await this.repository.persistAndFlush(orderModel);
    }

    async getOrdersByUserId(take: number, skip: number, userId: number) {
        return await this.em.execute("SELECT DISTINCT id_order, created_at, status FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
          [userId, take, skip]);
    }

    async getOrdersByStatusAndUserId(take: number, skip: number, status: string | null, userId: number) {
        if(status === null) {
            return await this.em.execute("SELECT DISTINCT id_order, created_at, status, user_id FROM orders WHERE user_id = ? AND status IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?",
              [userId, take, skip]);
        } else {
            return await this.em.execute("SELECT DISTINCT id_order, created_at, status, user_id FROM orders WHERE status = ? AND user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
              [status, userId, take, skip]);
        }
    }
    async deleteOrderByOrderId(orderId: string) {
        await this.repository.nativeDelete({ id_order: orderId });
    }

    async deleteOrdersByProductId(productId: number) {
        await this.repository.nativeDelete({ product: productId });
    }
    async deleteStatusByOrderId(orderId: string) {
        await this.repository.nativeUpdate({ id_order: orderId }, { status: null });
    }
    async addAdminNoteByIdOrder(idOrder: string, note: string) {
        await this.repository.nativeUpdate({ id_order: idOrder }, { admin_note: note });
    }

    async getCountOrdersByStatusAndUserId(status: string, userId: number) {
        if(status && status !== "not_completed") {
            return (await this.em.execute("SELECT COUNT(DISTINCT id_order, user_id) AS 'value' FROM orders WHERE status = ? AND user_id = ?", [status, userId]))[0].value;
        }
        if(status && status === "not_completed") {
            return (await this.em.execute("SELECT COUNT(DISTINCT id_order, user_id) AS 'value' FROM orders WHERE status IS NULL AND user_id = ?", [userId]))[0].value;
        }
        return (await this.em.execute("SELECT COUNT(DISTINCT id_order, user_id) AS 'value' FROM orders WHERE user_id = ?", [userId]))[0].value;
    }

    async deleteOrdersByUserId(userId: number) {
        await this.repository.nativeDelete({ user_id: userId });
    }

    async getOrderAndProductByOrderIdAndUserId(orderId: string, userId: number) {
          return await this.repository.find({ id_order: orderId, user_id: userId }, { populate: ["product"] })
    }

    async changeStatusByOrderIdAndUserId(idOrder: string, status: string, userId: number) {
        await this.repository.nativeUpdate({ id_order: idOrder, user_id: userId }, { status: status });
    }

    async getProductsByOrderIdAndUserId(orderId: string, userId: number) {
        return await this.repository.find({ id_order: orderId, user_id: userId }, { populate: ["product"]  })
    }
    async geOrdersAndProductsByOrderIdAndUserId(orderId: string, userId: number) {
        return await this.repository
          .createQueryBuilder("o")
          .select("*")
          .where("o.id_order = ?", [orderId])
          .andWhere("o.user_id = ?", [userId])
          .joinAndSelect("product", "p")
          .getResult();
    }
}
