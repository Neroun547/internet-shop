import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { VideoPhotoGalleryFiles } from "./video-photo-gallery-files.entity";
import { EntityRepository } from "@mikro-orm/mysql";

@Injectable()
export class VideoPhotoGalleryFilesServiceDb {
  constructor(@InjectRepository(VideoPhotoGalleryFiles) private repository: EntityRepository<VideoPhotoGalleryFiles>) {}

  async save(filename: string, idPublication: number) {
    await this.repository.nativeInsert({ file_name: filename, video_photo_gallery_id: idPublication });
  }
  async deleteByVideoPhotoGalleryId(id: number) {
    await this.repository.nativeDelete({ video_photo_gallery_id: id });
  }
  async getByVideoPhotoGalleryId(id: number) {
    return await this.repository.find({ video_photo_gallery_id: id });
  }
}
