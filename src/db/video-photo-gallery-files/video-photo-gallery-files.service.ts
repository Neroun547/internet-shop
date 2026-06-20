import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { VideoPhotoGalleryFiles } from "./video-photo-gallery-files.entity";
import { EntityRepository } from "@mikro-orm/mysql";
import { VideoPhotoGalleryFilesMapper } from "./video-photo-gallery-files.mapper";
import { VideoPhotoGalleryFilesInterface } from "./interfaces/video-photo-gallery-files.interface";

@Injectable()
export class VideoPhotoGalleryFilesServiceDb {
  constructor(@InjectRepository(VideoPhotoGalleryFiles) private repository: EntityRepository<VideoPhotoGalleryFiles>) {}

  async save(filename: string, idPublication: number): Promise<void> {
    const newModel = VideoPhotoGalleryFilesMapper.toPersist({ file_name: filename, video_photo_gallery_id: idPublication, video_photo_gallery: idPublication });
    
    await this.repository.getEntityManager().persist(newModel).flush();
  }
  async deleteByVideoPhotoGalleryId(id: number): Promise<void> {
    await this.repository.nativeDelete({ video_photo_gallery_id: id });
  }
  async getByVideoPhotoGalleryId(id: number): Promise<VideoPhotoGalleryFilesInterface[]> {
    const data = await this.repository.find({ video_photo_gallery_id: id });

    return data.map(item => VideoPhotoGalleryFilesMapper.toDomain(item));
  }
}
