import { EntityData, Loaded } from "@mikro-orm/core";
import { Orders } from "./orders.entity";
import { OrdersInterface } from "./interfaces/orders.interface";
import { ProductsMapper } from "../products/products.mapper";
import { getProductIdFromEntity, getUserIdFromEntity } from "src/common/utils";

export class OrdersMapper {
    static toDomain(entity: Loaded<Orders>): OrdersInterface {
        return {
            product_id: getProductIdFromEntity(entity) ?? 0,
            count: entity.count,
            id_order: entity.id_order,
            contact_info: entity.contact_info,
            remark: entity.remark,
            status: entity.status,
            first_name: entity.first_name,
            last_name: entity.last_name,
            admin_note: entity.admin_note,
            user_id: getUserIdFromEntity(entity) ?? 0,
            product: entity.product && typeof entity.product !== "number" ? ProductsMapper.toDomain(entity.product) : undefined,
            created_at: entity.created_at
        }
    }
    static toDomainDataFromNativeSql(entity: EntityData<Partial<any>>): OrdersInterface {
        return {
            product_id: getProductIdFromEntity(entity) ?? 0,
            count: entity.count,
            id_order: entity.id_order,
            contact_info: entity.contact_info,
            remark: entity.remark,
            status: entity.status,
            first_name: entity.first_name,
            last_name: entity.last_name,
            admin_note: entity.admin_note,
            user_id: getUserIdFromEntity(entity) ?? 0,
            product: entity.product ? ProductsMapper.toDomain(entity.product) : undefined,
            created_at: entity.created_at
        }
    }
    static toPersist(data: OrdersInterface): Orders {
        const newModel = new Orders();

        for(let key in data) {
            newModel[key] = data[key];
        }
        newModel.user = data.user_id;
        newModel.product = data.product_id;

        return newModel;
    }
}

