import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { VideoPhotoGalleryFiles } from "../video-photo-gallery-files/video-photo-gallery-files.entity";
import { Collection } from "@mikro-orm/core";
import { Users } from "../users/users.entity";

@Entity()
export class VideoPhotoGallery {
  @PrimaryKey({ type: "integer" })
  id: number;

  @Property({ type: "varchar" })
  name: string;

  @Property({ type: "varchar" })
  theme: string;

  @Property({ type: "varchar" })
  description: string;

  user_id: number;

  @OneToMany({ entity: () => VideoPhotoGalleryFiles, mappedBy: "video_photo_gallery" })
  videoPhotoGalleryFiles: Collection<VideoPhotoGalleryFiles>;

  @ManyToOne(() => Users, { fieldName: "user_id", deleteRule: "cascade" })
  user: Users | number;
}

