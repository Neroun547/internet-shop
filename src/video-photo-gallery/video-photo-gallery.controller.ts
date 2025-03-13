import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { VideoPhotoGalleryService } from "./service/video-photo-gallery.service";
import { GALLERY_STEP } from "./constants";

@Controller()
export class VideoPhotoGalleryController {
  constructor(
    private videoPhotoGalleryService: VideoPhotoGalleryService
  ) {}

  @Get()
  async getVideoPhoto() {
    return await this.videoPhotoGalleryService.getPublications(GALLERY_STEP, 0);
  }

  @Get("load-more")
  async loadMore(@Query("take", new ParseIntPipe()) take: number, @Query("skip", new ParseIntPipe()) skip: number) {
    return this.videoPhotoGalleryService.getPublications(take, skip);
  }

  @Get(":id")
  async getPublicationById(@Param("id", new ParseIntPipe()) id: number) {
    const publicationAndFiles = await this.videoPhotoGalleryService.getPublicationById(id);

    return {
      name: publicationAndFiles.name,
      theme: publicationAndFiles.theme,
      description: publicationAndFiles.description,
      files: publicationAndFiles.videoPhotoGalleryFiles
    }
  }
}
