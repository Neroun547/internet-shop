import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { VideoPhotoGallery } from "./video-photo-gallery.entity";
import { EntityRepository } from "@mikro-orm/mysql";
import { VideoPhotoGalleryInterface } from "./interfaces/video-photo-gallery.interface";
import { VideoPhotoGalleryMapper } from "./video-photo-gallery.mapper";

@Injectable()
export class VideoPhotoGalleryServiceDb {
  constructor(@InjectRepository(VideoPhotoGallery) private repository: EntityRepository<VideoPhotoGallery>) {}

  async saveAndReturn(data: VideoPhotoGalleryInterface): Promise<VideoPhotoGalleryInterface> {
    const model = VideoPhotoGalleryMapper.toPersist(data);

    await this.repository.getEntityManager().persist(model).flush();

    return VideoPhotoGalleryMapper.toDomain(model);
  }

  async getPublicationAndFiles(count: number, skip: number): Promise<VideoPhotoGalleryInterface[]> {
    const data = await this.repository
      .createQueryBuilder()
      .select("*")
      .joinAndSelect("videoPhotoGalleryFiles", "files")
      .offset(skip)
      .limit(count)
      .orderBy({ id: "DESC" })
      .getResult();

    return data.map(item => VideoPhotoGalleryMapper.toDomainWithFiles(item));
  }

  async getPublicationAndFilesById(id: number): Promise<VideoPhotoGalleryInterface | null> {
    const data = (await this.repository
      .createQueryBuilder("publication")
      .select("*")
      .joinAndSelect("videoPhotoGalleryFiles", "files")
      .where("publication.id = ?", [id])
      .getResult())[0];

    if(!data) {
      return null;
    }
    return VideoPhotoGalleryMapper.toDomainWithFiles(data);
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.nativeDelete({ id: id });
  }

  async getPublicationById(id: number): Promise<VideoPhotoGalleryInterface | null> {
    const data = (await this.repository
      .createQueryBuilder("publication")
      .select("*")
      .joinAndSelect("videoPhotoGalleryFiles", "files")
      .where("publication.id = ?", [id])
      .getResult())[0];

    if(!data) {
      return null;
    }
    return VideoPhotoGalleryMapper.toDomainWithFiles(data);
  }

  async updateById(id: number, data: VideoPhotoGalleryInterface): Promise<void> {
    await this.repository.nativeUpdate({ id: id }, data);
  }

  async getPublicationAndFilesByUserId(userId: number): Promise<VideoPhotoGalleryInterface[]> {
    const data = await this.repository
      .createQueryBuilder("publication")
      .select("*")
      .joinAndSelect("videoPhotoGalleryFiles", "files")
      .where("publication.user_id = ?", [userId])
      .getResult();

    return data.map(item => VideoPhotoGalleryMapper.toDomainWithFiles(item));
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.nativeDelete({ user_id: userId });
  }
}
