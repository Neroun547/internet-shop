import { Controller, Get, Param, ParseIntPipe, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { VideoPhotoGalleryService } from "./service/video-photo-gallery.service";

@Controller()
export class VideoPhotoGalleryController {
  constructor(private videoPhotoGalleryService: VideoPhotoGalleryService) {}

  @Get()
  async videoPhotoGalleryPage(@Res() res: Response) {
    const publications = await this.videoPhotoGalleryService.getPublications(12, 0);
    res.render("video-photo-gallery/video-photo-gallery", {
      publications: publications,
      styles: ["/css/video-photo-gallery/video-photo-gallery.css"],
      scripts: ["/js/video-photo-gallery/video-photo-gallery.js"]
    });
  }

  @Get("publications")
  async getPublications(@Query("skip", new ParseIntPipe()) skip: number, @Query("count", new ParseIntPipe()) count: number) {
    return await this.videoPhotoGalleryService.getPublications(count, skip);
  }

  @Get("load-more")
  async loadMore(@Query("take", new ParseIntPipe()) take: number, @Query("skip", new ParseIntPipe()) skip: number) {
    return this.videoPhotoGalleryService.getPublications(take, skip);
  }

  @Get(":id")
  async getPublicationById(@Param("id", new ParseIntPipe()) id: number, @Res() res: Response) {
    const publicationAndFiles = await this.videoPhotoGalleryService.getPublicationById(id);

    res.render("video-photo-gallery/video-photo-gallery-item", {
      name: publicationAndFiles.name,
      theme: publicationAndFiles.theme,
      description: publicationAndFiles.description,
      files: publicationAndFiles.videoPhotoGalleryFiles,
      styles: ["/css/video-photo-gallery/video-photo-gallery-item.css"],
      scripts: ["/js/video-photo-gallery/video-photo-gallery-item.js"]
    });
  }
}
