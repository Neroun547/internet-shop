import { Module } from "@nestjs/common";
import { PartnersController } from "./partners.controller";
import { PartnersService } from "./service/partners.service";
import { UsersModuleDb } from "../../../db/users/users.module";
import { CommonModule } from "../../../common/common.module";
import { ProductsModuleDb } from "../../../db/products/products.module";
import { ProductsImagesModuleDb } from "../../../db/products-images/products-images.module";
import { ArticlesModuleDb } from "../../../db/articles/articles.module";
import { VideoPhotoGalleryModuleDb } from "../../../db/video-photo-gallery/video-photo-gallery.module";
import { VideoPhotoGalleryFilesModuleDb } from "../../../db/video-photo-gallery-files/video-photo-gallery-files.module";
import { OrdersModuleDb } from "../../../db/orders/orders.module";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [
    UsersModuleDb,
    CommonModule,
    ProductsModuleDb,
    ProductsImagesModuleDb,
    ArticlesModuleDb,
    VideoPhotoGalleryModuleDb,
    VideoPhotoGalleryFilesModuleDb,
    OrdersModuleDb,
    OrdersModule
  ],
  controllers: [PartnersController],
  providers: [PartnersService]
})
export class PartnersModule {}
