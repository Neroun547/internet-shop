import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { VideoPhotoGalleryFilesServiceDb } from "./video-photo-gallery-files.service";
import { VideoPhotoGalleryFiles } from "./video-photo-gallery-files.entity";

@Module({
  imports: [MikroOrmModule.forFeature([VideoPhotoGalleryFiles])],
  providers: [VideoPhotoGalleryFilesServiceDb],
  exports: [VideoPhotoGalleryFilesServiceDb]
})
export class VideoPhotoGalleryFilesModuleDb {}
