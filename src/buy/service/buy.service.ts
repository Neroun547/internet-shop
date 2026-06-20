import { Injectable } from "@nestjs/common";
import {ProductsServiceDb} from "../../db/products/products.service";
import {AddOrderDto} from "../dto/add-order.dto";
import {OrdersServiceDb} from "../../db/orders/orders.service";
import { NotificationsService } from "src/notifications/notifications.service";
import { ProductsInterface } from "src/db/products/interfaces/products.interface";

@Injectable()
export class BuyService {
    constructor(
        private productsServiceDb: ProductsServiceDb,
        private ordersServiceDb: OrdersServiceDb,
        private notificationsService: NotificationsService
    ) {}


    async addOrder(order: AddOrderDto) {
        const hashOrder = String(Date.now() + Math.floor(Math.random() * 10000));
        let tmpProduct: ProductsInterface | null;

        const recipientsOrder: Array<number> = [];

        for(let i = 0; i < order.products.length; i++) {
            tmpProduct = (await this.productsServiceDb.getProductById(Number(order.products[i].id)));

            if(tmpProduct && tmpProduct.user_id) {
                await this.ordersServiceDb.saveOrderAndReturn({
                    product_id: Number(order.products[i].id),
                    count: order.products[i].count,
                    id_order: hashOrder,
                    contact_info: order.contact_info,
                    status: null,
                    remark: order.remark.trim().length ? order.remark.trim() : "",
                    first_name: order.first_name,
                    last_name: order.last_name,
                    admin_note: "",
                    user_id: tmpProduct.user_id
                });
                recipientsOrder.push(tmpProduct.user_id);
            }
        }
        this.notificationsService.pushOrderEmailNotificationsByUsersIds(
            Array.from(new Set(recipientsOrder)), 
            { 
                firstName: order.first_name, 
                lastName: order.last_name, 
                remark: order.remark, 
                contactInfo: order.contact_info 
            }
        ).catch(error => {
            console.log("Push notification by email error:", error);
        })
    }
}

