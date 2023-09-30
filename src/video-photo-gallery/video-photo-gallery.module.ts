import { forwardRef, Module } from "@nestjs/common";
import { VideoPhotoGalleryController } from "./video-photo-gallery.controller";
import { VideoPhotoGalleryService } from "./service/video-photo-gallery.service";
import { VideoPhotoGalleryModuleDb } from "../../db/video-photo-gallery/video-photo-gallery.module";
import { VideoPhotoGalleryModuleAdmin } from "../admin/video-photo-gallery/video-photo-gallery.module";

@Module({
  imports: [VideoPhotoGalleryModuleDb, forwardRef(() => VideoPhotoGalleryModuleAdmin)],
  controllers: [VideoPhotoGalleryController],
  providers: [VideoPhotoGalleryService],
  exports: [VideoPhotoGalleryService]
})
export class VideoPhotoGalleryModule {}