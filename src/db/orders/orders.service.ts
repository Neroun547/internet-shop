import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Orders} from "./orders.entity";
import {EntityManager, EntityRepository} from "@mikro-orm/mysql";
import {OrdersInterface} from "./interfaces/orders.interface";
import { OrdersMapper } from "./orders.mapper";

@Injectable()
export class OrdersServiceDb {
    constructor(
        @InjectRepository(Orders) private repository: EntityRepository<Orders>,
        private em: EntityManager
        ) {}

    async saveOrderAndReturn(order: OrdersInterface): Promise<OrdersInterface> {
        const orderModel = OrdersMapper.toPersist(order);

        await this.repository.getEntityManager().persist(orderModel).flush();

        return OrdersMapper.toDomain(orderModel);
    }

    async getOrdersByUserId(take: number, skip: number, userId: number): Promise<OrdersInterface[]> {
        const data = await this.em.execute("SELECT DISTINCT id_order, created_at, status FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
          [userId, take, skip]);

          return data.map(item => OrdersMapper.toDomainDataFromNativeSql(item));
    }

    async getOrdersByStatusAndUserId(take: number, skip: number, status: string | null, userId: number): Promise<OrdersInterface[]> {
        if(status === null) {
            const data = await this.em.execute("SELECT DISTINCT id_order, created_at, status, user_id FROM orders WHERE user_id = ? AND status IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?",
              [userId, take, skip]);

            return data.map(item => OrdersMapper.toDomainDataFromNativeSql(item));
        } else {
            const data = await this.em.execute("SELECT DISTINCT id_order, created_at, status, user_id FROM orders WHERE status = ? AND user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
              [status, userId, take, skip]);

            return data.map(item => OrdersMapper.toDomainDataFromNativeSql(item));
        }
    }
    async deleteOrderByOrderId(orderId: string): Promise<void> {
        await this.repository.nativeDelete({ id_order: orderId });
    }

    async deleteOrdersByProductId(productId: number): Promise<void> {
        await this.repository.nativeDelete({ product: productId });
    }
    async deleteStatusByOrderId(orderId: string): Promise<void> {
        await this.repository.nativeUpdate({ id_order: orderId }, { status: null });
    }
    async addAdminNoteByIdOrder(idOrder: string, note: string): Promise<void> {
        await this.repository.nativeUpdate({ id_order: idOrder }, { admin_note: note });
    }

    async getCountOrdersByStatusAndUserId(status: string, userId: number): Promise<number> {
        if(status && status !== "not_completed") {
            return (await this.em.execute("SELECT COUNT(DISTINCT id_order, user_id) AS 'value' FROM orders WHERE status = ? AND user_id = ?", [status, userId]))[0].value;
        }
        if(status && status === "not_completed") {
            return (await this.em.execute("SELECT COUNT(DISTINCT id_order, user_id) AS 'value' FROM orders WHERE status IS NULL AND user_id = ?", [userId]))[0].value;
        }
        return (await this.em.execute("SELECT COUNT(DISTINCT id_order, user_id) AS 'value' FROM orders WHERE user_id = ?", [userId]))[0].value;
    }

    async deleteOrdersByUserId(userId: number): Promise<void> {
        await this.repository.nativeDelete({ user_id: userId });
    }

    async getOrderAndProductByOrderIdAndUserId(orderId: string, userId: number): Promise<OrdersInterface[]> {
        const data = await this.repository.find({ id_order: orderId, user_id: userId }, { populate: ["product"] })

        return data.map(item => OrdersMapper.toDomain(item));
    }

    async changeStatusByOrderIdAndUserId(idOrder: string, status: string, userId: number): Promise<void> {
        await this.repository.nativeUpdate({ id_order: idOrder, user_id: userId }, { status: status });
    }

    async getProductsByOrderIdAndUserId(orderId: string, userId: number): Promise<OrdersInterface[]> {
        const data = await this.repository.find({ id_order: orderId, user_id: userId }, { populate: ["product"]  })

        return data.map(item => OrdersMapper.toDomain(item));
    }
    async geOrdersAndProductsByOrderIdAndUserId(orderId: string, userId: number): Promise<OrdersInterface[]> {
        const data = await this.repository
          .createQueryBuilder("o")
          .select("*")
          .where("o.id_order = ?", [orderId])
          .andWhere("o.user_id = ?", [userId])
          .joinAndSelect("product", "p")
          .getResult();

        return data.map(item => OrdersMapper.toDomain(item));
    }
}
