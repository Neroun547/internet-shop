import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { VideoPhotoGalleryFilesInterface } from "./interfaces/video-photo-gallery-files.interface";
import { VideoPhotoGallery } from "../video-photo-gallery/video-photo-gallery.entity";

@Entity()
export class VideoPhotoGalleryFiles implements VideoPhotoGalleryFilesInterface {
  @PrimaryKey()
  id: number;

  @Property()
  file_name: string;

  @Property()
  video_photo_gallery_id: number;

  @ManyToOne({ entity: () => VideoPhotoGallery })
  video_photo_gallery: VideoPhotoGallery
}
