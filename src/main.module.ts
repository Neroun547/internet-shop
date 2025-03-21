import {Module} from '@nestjs/common';
import {RouterModule} from "@nestjs/core";
import {AuthModule} from "./admin/auth/auth.module";
import {AdminModule} from "./admin/admin.module";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {ConfigModule} from "@nestjs/config";
import { ProductsModule } from "./products/products.module";
import { ProductsModuleAdmin } from "./admin/products/products.module";
import {BuyModule} from "./buy/buy.module";
import {OrdersModule} from "./admin/orders/orders.module";
import {SupportChatModule} from "./support-chat/support-chat.module";
import {SupportChatAuthModule} from "./support-chat/auth/support-chat-auth.module";
import {SupportChatSignupModule} from "./support-chat/signup/support-chat-signup.module";
import {SupportChatModuleAdmin} from "./admin/support-chat/support-chat.module";
import { ArticlesModule } from "./articles/articles.module";
import { ArticlesModuleAdmin } from "./admin/articles/articles.module";
import {StatisticsModule} from "./admin/statistics/statistics.module";
import {StatisticsModuleDb} from "../db/statistics/statistics.module";
import {CommonModule} from "../common/common.module";
import { VideoPhotoGalleryModule } from "./video-photo-gallery/video-photo-gallery.module";
import { VideoPhotoGalleryModuleAdmin } from "./admin/video-photo-gallery/video-photo-gallery.module";
import { TranslateModule } from "./translate/translate.module";
import { TranslateModuleDb } from "../db/translate/translate.module";
import { PartnersModule } from "./admin/partners/partners.module";
import { RubricsModuleAdmin } from "./admin/rubrics/rubrics.module";
import { RubricsModuleDb } from "../db/rubrics/rubrics.module";
import { RubricsModule } from "./rubrics/rubrics.module";
import { RubricsTypesModuleDb } from "../db/rubrics-types/rubrics-types.module";
import {ProductsModuleDb} from "../db/products/products.module";
import { PricesModule } from "./products/prices/prices.module";

@Module({
  imports: [
      StatisticsModuleDb,
      ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true
      }),
      AuthModule,
      AdminModule,
      ProductsModule,
      ProductsModuleAdmin,
      BuyModule,
      OrdersModule,
      SupportChatModule,
      SupportChatAuthModule,
      SupportChatSignupModule,
      SupportChatModuleAdmin,
      ArticlesModule,
      ArticlesModuleAdmin,
      StatisticsModule,
      CommonModule,
      VideoPhotoGalleryModule,
      VideoPhotoGalleryModuleAdmin,
      TranslateModule,
      TranslateModuleDb,
      PartnersModule,
      RubricsModuleAdmin,
      RubricsModuleDb,
      RubricsModule,
      RubricsTypesModuleDb,
      ProductsModuleDb,
      PricesModule,
      MikroOrmModule.forRoot({
          dbName: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          type: "mysql",
          port: Number(process.env.DB_PORT),
          entities: [],
          autoLoadEntities: true,
          allowGlobalContext: true
      }),
      RouterModule.register([
          {
            path: "admin",
            module: AdminModule,
            children: [
                { path: "products", module: ProductsModuleAdmin },
                { path: "orders", module: OrdersModule },
                { path: "auth", module: AuthModule },
                { path: "support", module: SupportChatModuleAdmin },
                { path: "articles", module: ArticlesModuleAdmin },
                { path: "statistics", module: StatisticsModule },
                { path: "video-photo-gallery", module: VideoPhotoGalleryModuleAdmin },
                { path: "partners", module: PartnersModule },
                { path: "rubrics", module: RubricsModuleAdmin }
            ]
          },
          {
              path: "products",
              module: ProductsModule,
              children: [
                  { path: "prices", module: PricesModule }
              ]
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
          },
          {
              path: "articles",
              module: ArticlesModule
          },
          {
              path: "video-photo-gallery",
              module: VideoPhotoGalleryModule
          },
          {
              path: "translate",
              module: TranslateModule
          },
          {
              path: "rubrics",
              module: RubricsModule
          }
      ])
  ],
  controllers: [],
  providers: []
})
export class MainModule {}
