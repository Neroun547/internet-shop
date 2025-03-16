import { Module } from "@nestjs/common";
import { VideoPhotoGalleryController } from "./video-photo-gallery.controller";
import { VideoPhotoGalleryService } from "./service/video-photo-gallery.service";
import { VideoPhotoGalleryModuleDb } from "../../db/video-photo-gallery/video-photo-gallery.module";
import { TranslateModule } from "../translate/translate.module";
import { CommonModule } from "../../common/common.module";

@Module({
  imports: [VideoPhotoGalleryModuleDb, TranslateModule, CommonModule],
  controllers: [VideoPhotoGalleryController],
  providers: [VideoPhotoGalleryService],
  exports: [VideoPhotoGalleryService]
})
export class VideoPhotoGalleryModule {}
