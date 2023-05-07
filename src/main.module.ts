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
import {ChatModule} from "./chat/chat.module";
import {ChatAuthModule} from "./chat/auth/chat-auth.module";
import {ChatSignupModule} from "./chat/signup/chat-signup.module";

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
      ChatModule,
      ChatAuthModule,
      ChatSignupModule,
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
            path: "admin/auth",
            module: AuthModule
          },
          {
              path: "admin",
              module: AdminModule
          },
          {
              path: "admin/products",
              module: ProductsModuleAdmin
          },
          {
              path: "admin/orders",
              module: OrdersModule
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
              path: "chat",
              module: ChatModule,
              children: [
                  { path: "auth", module: ChatAuthModule },
                  { path: "signup", module: ChatSignupModule }
              ]
          }
      ])
  ],
  controllers: [MainController],
  providers: [],
})
export class MainModule {}
