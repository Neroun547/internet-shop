import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { VideoPhotoGallery } from "./video-photo-gallery.entity";
import { VideoPhotoGalleryServiceDb } from "./video-photo-gallery.service";

@Module({
  imports: [MikroOrmModule.forFeature([VideoPhotoGallery])],
  providers: [VideoPhotoGalleryServiceDb],
  exports: [VideoPhotoGalleryServiceDb]
})
export class VideoPhotoGalleryModuleDb {}
