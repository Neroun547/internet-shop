import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { VideoPhotoGalleryServiceDb } from "../../../../db/video-photo-gallery/video-photo-gallery.service";
import { UploadVideoPhotoDto } from "../dto/upload-video-photo.dto";
import {
  VideoPhotoGalleryFilesServiceDb
} from "../../../../db/video-photo-gallery-files/video-photo-gallery-files.service";
import { rename, unlink } from "fs/promises";
import { resolve } from "path";
import { VideoPhotoGalleryService } from "../../../video-photo-gallery/service/video-photo-gallery.service";
import { existsSync } from "fs";

@Injectable()
export class VideoPhotoGalleryServiceAdmin {
  constructor(
    private videoPhotoGalleryServiceDb: VideoPhotoGalleryServiceDb,
    private videoPhotoGalleryFilesServiceDb: VideoPhotoGalleryFilesServiceDb,
    @Inject(forwardRef(() => VideoPhotoGalleryService)) private videoPhotoGalleryService: VideoPhotoGalleryService
  ) {}

  async savePublication(body: UploadVideoPhotoDto, files: Array<Express.Multer.File>, userId: number) {
    const publication = await this.videoPhotoGalleryServiceDb.saveAndReturn({ ...body, user_id: userId });

    await this.saveFiles(files, publication.id);
  }

  async getPublications(count: number, skip: number) {
    return await this.videoPhotoGalleryService.getPublications(count, skip);
  }

  async deletePublicationById(id: number) {
    const videoPhotoGalleryFiles = await this.videoPhotoGalleryFilesServiceDb.getByVideoPhotoGalleryId(id);

    for(let i = 0; i < videoPhotoGalleryFiles.length; i++) {
      if(existsSync(resolve("static/gallery/" + videoPhotoGalleryFiles[i].file_name))) {
        await unlink(resolve("static/gallery/" + videoPhotoGalleryFiles[i].file_name));
      }
    }
    await this.videoPhotoGalleryFilesServiceDb.deleteByVideoPhotoGalleryId(id);
    await this.videoPhotoGalleryServiceDb.deleteById(id);
  }

  async getPublicationById(id: number) {
    return await this.videoPhotoGalleryServiceDb.getPublicationById(id);
  }

  async editPublicationById(id: number, body: UploadVideoPhotoDto, files: Array<Express.Multer.File>, userId: number) {
    await this.videoPhotoGalleryServiceDb.updateById(id, { ...body, user_id: userId });

    if(files && files.length) {
      const oldFiles = await this.videoPhotoGalleryFilesServiceDb.getByVideoPhotoGalleryId(id);

      for(let i = 0; i < oldFiles.length; i++) {
        await unlink(resolve("static/gallery/" + oldFiles[i].file_name));
      }
      await this.videoPhotoGalleryFilesServiceDb.deleteByVideoPhotoGalleryId(id);
      await this.saveFiles(files, id);
    }
  }

  async saveFiles(files: Array<Express.Multer.File>, id: number) {
    for(let i = 0; i < files.length; i++) {
      if(files[i].mimetype === "image/jpeg") {
        await rename(files[i].path, "static/gallery/" + files[i].filename + ".jpeg");
        await this.videoPhotoGalleryFilesServiceDb.save(files[i].filename + ".jpeg", id);
      }
      if(files[i].mimetype === "image/png") {
        await rename(files[i].path, "static/gallery/" + files[i].filename + ".png");
        await this.videoPhotoGalleryFilesServiceDb.save(files[i].filename + ".png", id);
      }
      if(files[i].mimetype === "image/jpg") {
        await rename(files[i].path, "static/gallery/" + files[i].filename + ".jpg");
        await this.videoPhotoGalleryFilesServiceDb.save(files[i].filename + ".jpg", id);
      }
      if(files[i].mimetype === "video/mp4") {
        await rename(files[i].path, "static/gallery/" + files[i].filename + ".mp4");
        await this.videoPhotoGalleryFilesServiceDb.save(files[i].filename + ".mp4", id);
      }
      if(files[i].mimetype === "video/quicktime") {
        await rename(files[i].path, "static/gallery/" + files[i].filename + ".mov");
        await this.videoPhotoGalleryFilesServiceDb.save(files[i].filename + ".mov", id);
      }
    }
  }
}
