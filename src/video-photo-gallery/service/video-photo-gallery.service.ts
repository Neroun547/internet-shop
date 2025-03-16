import { Injectable, NotFoundException } from "@nestjs/common";
import { VideoPhotoGalleryServiceDb } from "../../../db/video-photo-gallery/video-photo-gallery.service";
import { CommonService } from "../../../common/common.service";

@Injectable()
export class VideoPhotoGalleryService {
  constructor(
    private videoPhotoGalleryServiceDb: VideoPhotoGalleryServiceDb,
    private commonService: CommonService
  ) {}

  async getPublications(count: number, skip: number) {
    const serializedData = JSON.parse(JSON.stringify(await this.videoPhotoGalleryServiceDb.getPublicationAndFiles(count, skip)));

    return serializedData.map((el) => {
      const videoMimeType = this.commonService.getVideoMimeType(el.videoPhotoGalleryFiles[0].file_name);

      return {
        id: el.id,
        name: el.name,
        theme: el.theme,
        description: el.description,
        previewFile: el.videoPhotoGalleryFiles[0].file_name,
        previewFileVideo: videoMimeType !== null,
        mimeType: videoMimeType
      }
    });
  }
  async getPublicationById(id: number) {
    const publicationAndFiles = JSON.parse(JSON.stringify(await this.videoPhotoGalleryServiceDb.getPublicationAndFilesById(id)));

    if(!publicationAndFiles) {
      throw new NotFoundException();
    }
    publicationAndFiles.videoPhotoGalleryFiles = publicationAndFiles.videoPhotoGalleryFiles.map(el => {

      if(el.file_name.substring(el.file_name.length - 4, el.file_name.length) === ".mov"
        || el.file_name.substring(el.file_name.length - 4, el.file_name.length) === ".mp4") {
        return {
          filename: el.file_name,
          type: "video"
        }
      }
      return {
        filename: el.file_name,
        type: "image"
      }
    });

    return publicationAndFiles;
  }
}
