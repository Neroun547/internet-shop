import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { VideoPhotoGallery } from "./video-photo-gallery.entity";
import { EntityRepository } from "@mikro-orm/mysql";
import { VideoPhotoGalleryInterface } from "./interfaces/video-photo-gallery.interface";

@Injectable()
export class VideoPhotoGalleryServiceDb {
  constructor(@InjectRepository(VideoPhotoGallery) private repository: EntityRepository<VideoPhotoGallery>) {}

  async saveAndReturn(data: VideoPhotoGalleryInterface) {
    const model = new VideoPhotoGallery();

    model.name = data.name;
    model.theme = data.theme;
    model.description = data.description;
    model.user_id = data.user_id;

    await this.repository.persistAndFlush(model);

    return model;
  }

  async getPublicationAndFiles(count: number, skip: number) {
    return await this.repository
      .createQueryBuilder()
      .select("*")
      .joinAndSelect("videoPhotoGalleryFiles", "files")
      .offset(skip)
      .limit(count)
      .orderBy({ id: "DESC" })
      .getResult();
  }

  async getPublicationAndFilesById(id: number) {
    return (await this.repository
      .createQueryBuilder("publication")
      .select("*")
      .joinAndSelect("videoPhotoGalleryFiles", "files")
      .where("publication.id = ?", [id])
      .getResult())[0];
  }

  async deleteById(id: number) {
    await this.repository.nativeDelete({ id: id });
  }

  async getPublicationById(id: number) {
    return (await this.repository
      .createQueryBuilder("publication")
      .select("*")
      .joinAndSelect("videoPhotoGalleryFiles", "files")
      .where("publication.id = ?", [id])
      .getResult())[0];
  }

  async updateById(id: number, data: VideoPhotoGalleryInterface) {
    await this.repository.nativeUpdate({ id: id }, data);
  }

  async getPublicationAndFilesByUserId(userId: number) {
    return await this.repository
      .createQueryBuilder("publication")
      .select("*")
      .joinAndSelect("videoPhotoGalleryFiles", "files")
      .where("publication.user_id = ?", [userId])
      .getResult()
  }

  async deleteByUserId(userId: number) {
    await this.repository.nativeDelete({ user_id: userId });
  }
}
