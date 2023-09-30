import { forwardRef, Module } from "@nestjs/common";
import { VideoPhotoGalleryController } from "./video-photo-gallery.controller";
import { VideoPhotoGalleryServiceAdmin } from "./service/video-photo-gallery.service";
import { VideoPhotoGalleryModuleDb } from "../../../db/video-photo-gallery/video-photo-gallery.module";
import { MulterModule } from "@nestjs/platform-express";
import {
  VideoPhotoGalleryFilesModuleDb
} from "../../../db/video-photo-gallery-files/video-photo-gallery-files.module";
import { VideoPhotoGalleryModule } from "../../video-photo-gallery/video-photo-gallery.module";

@Module({
  imports: [
    MulterModule.register({
      dest: 'static/gallery',
    }),
    VideoPhotoGalleryModuleDb,
    VideoPhotoGalleryFilesModuleDb,
    forwardRef(() => VideoPhotoGalleryModule)
  ],
  controllers: [VideoPhotoGalleryController],
  providers: [VideoPhotoGalleryServiceAdmin],
  exports: [VideoPhotoGalleryServiceAdmin]
})
export class VideoPhotoGalleryModuleAdmin {}
