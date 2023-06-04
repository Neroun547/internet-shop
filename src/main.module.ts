import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import {RouterModule} from "@nestjs/core";
import {AuthModule} from "./admin/auth/auth.module";
import {AdminModule} from "./admin/admin.module";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {ConfigModule} from "@nestjs/config";
import { ProductsModule } from "./products/products.module";
import { ProductsModuleAdmin } from "./admin/products/products.module";
import {BasketModule} from "./basket/basket.module";
import {BuyModule} from "./buy/buy.module";
import {OrdersModule} from "./admin/orders/orders.module";
import {SupportChatModule} from "./support-chat/support-chat.module";
import {SupportChatAuthModule} from "./support-chat/auth/support-chat-auth.module";
import {SupportChatSignupModule} from "./support-chat/signup/support-chat-signup.module";
import {SupportChatModuleAdmin} from "./admin/support-chat/support-chat.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true
      }),
      AuthModule,
      AdminModule,
      ProductsModule,
      ProductsModuleAdmin,
      BasketModule,
      BuyModule,
      OrdersModule,
      SupportChatModule,
      SupportChatAuthModule,
      SupportChatSignupModule,
      SupportChatModuleAdmin,
      MikroOrmModule.forRoot({
          dbName: "internet_shop",
          user: "root",
          password: "root",
          type: "mysql",
          port: 3306,
          entities: [],
          autoLoadEntities: true
      }),
      RouterModule.register([
          {
            path: "admin",
            module: AdminModule,
            children: [
                { path: "products", module: ProductsModuleAdmin },
                { path: "orders", module: OrdersModule },
                { path: "auth", module: AuthModule },
                { path: "support", module: SupportChatModuleAdmin }
            ]
          },
          {
              path: "products",
              module: ProductsModule
          },
          {
              path: "basket",
              module: BasketModule
          },
          {
              path: "buy",
              module: BuyModule
          },
          {
              path: "support",
              module: SupportChatModule,
              children: [
                  { path: "auth", module: SupportChatAuthModule },
                  { path: "signup", module: SupportChatSignupModule }
              ]
          }
      ])
  ],
  controllers: [MainController],
  providers: [],
})
export class MainModule {}
