import { Controller, Get, Param, ParseIntPipe, Query, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { VideoPhotoGalleryService } from "./service/video-photo-gallery.service";
import { TranslateService } from "../translate/service/translate.service";
import { CommonService } from "../../common/common.service";

@Controller()
export class VideoPhotoGalleryController {
  constructor(
    private videoPhotoGalleryService: VideoPhotoGalleryService,
    private translateService: TranslateService,
    private commonService: CommonService
  ) {}

  @Get()
  async videoPhotoGalleryPage(@Req() req: Request, @Res() res: Response, @Query("rubricId") rubricId) {
    const publications = await this.videoPhotoGalleryService.getPublications(12, 0);
    const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("video_photo_gallery_page", req.cookies["iso_code_shop"]);

    res.render("video-photo-gallery/video-photo-gallery", {
      publications: publications,
      styles: ["/css/video-photo-gallery/video-photo-gallery.css"],
      scripts: ["/js/video-photo-gallery/video-photo-gallery.js"],
      activeLanguage: req.cookies["iso_code_shop"],
      ...translate,
      filtersMenuItems: await this.commonService.getRubricsTypesForPages(rubricId),
      rubric_id: rubricId
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
  async getPublicationById(@Req() req: Request, @Param("id", new ParseIntPipe()) id: number, @Res() res: Response) {
    const publicationAndFiles = await this.videoPhotoGalleryService.getPublicationById(id);
    const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("video_photo_gallery_page", req.cookies["iso_code_shop"]);

    res.render("video-photo-gallery/video-photo-gallery-item", {
      name: publicationAndFiles.name,
      theme: publicationAndFiles.theme,
      description: publicationAndFiles.description,
      files: publicationAndFiles.videoPhotoGalleryFiles,
      styles: ["/css/video-photo-gallery/video-photo-gallery-item.css"],
      scripts: ["/js/video-photo-gallery/video-photo-gallery-item.js"],
      activeLanguage: req.cookies["iso_code_shop"],
      ...translate
    });
  }
}
