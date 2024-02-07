import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { VideoPhotoGalleryInterface } from "./interfaces/video-photo-gallery.interface";
import { VideoPhotoGalleryFiles } from "../video-photo-gallery-files/video-photo-gallery-files.entity";

@Entity()
export class VideoPhotoGallery implements VideoPhotoGalleryInterface {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  theme: string;

  @Property()
  description: string;

  @Property()
  user_id: number;

  @OneToMany({ entity: () => VideoPhotoGalleryFiles, mappedBy: "video_photo_gallery" })
  videoPhotoGalleryFiles: Collection<VideoPhotoGalleryFiles>;
}

