import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { VideoPhotoGallery } from "../video-photo-gallery/video-photo-gallery.entity";

@Entity()
export class VideoPhotoGalleryFiles {
  @PrimaryKey({ type: "integer" })
  id: number;

  @Property({ type: "varchar" })
  file_name: string;

  @ManyToOne({ entity: () => VideoPhotoGallery, fieldName: "video_photo_gallery_id" })
  video_photo_gallery: VideoPhotoGallery

  video_photo_gallery_id: number;
}
