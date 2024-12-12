import { Injectable } from "@nestjs/common";
import {ProductsServiceDb} from "../../../db/products/products.service";
import {BasketService} from "../../basket/service/basket.service";
import {AddOrderDto} from "../dto/add-order.dto";
import {OrdersServiceDb} from "../../../db/orders/orders.service";
import { SettingsServiceDb } from "../../../db/settings/settings.service";
const webPush = require("web-push");

@Injectable()
export class BuyService {
    constructor(
        private productsServiceDb: ProductsServiceDb,
        private basketService: BasketService,
        private ordersServiceDb: OrdersServiceDb,
        private settingsServiceDb: SettingsServiceDb
    ) {}


    async addOrder(order: AddOrderDto) {
        const hashOrder = String(Date.now() + Math.floor(Math.random() * 10000));

        for(let i = 0; i < order.products.length; i++) {
            await this.ordersServiceDb.saveOrder({
                product: Number(order.products[i].id),
                count: order.products[i].count,
                id_order: hashOrder,
                contact_info: order.contact_info,
                status: null,
                remark: order.remark.trim().length ? order.remark.trim() : "",
                first_name: order.first_name,
                last_name: order.last_name,
                admin_note: "",
                user_id: (await this.productsServiceDb.getProductById(Number(order.products[i].id))).user_id
            });
        }
        console.log(process.env.PUSH_MESSAGES_PUBLIC_KEY)
        webPush.setVapidDetails(
          "https://zolotar.shop/",
          process.env.PUSH_MESSAGES_PUBLIC_KEY,
          process.env.PUSH_MESSAGES_PRIVATE_KEY
        );
        const subscription = JSON.parse((await this.settingsServiceDb.getSettingByKey("push_messages_subscription")).setting_value);

        setTimeout(() => {
            const payload = null;
            const options = {
                TTL: 20,
            };
            webPush.sendNotification(subscription, payload, options)
              .then(success => {
                  console.log(success)
              })
              .catch(e => {
                  console.log(e)
              })
        }, 10000);
    }
}

