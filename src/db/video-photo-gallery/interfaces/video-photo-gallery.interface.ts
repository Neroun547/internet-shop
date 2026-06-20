import { VideoPhotoGalleryFilesInterface } from "src/db/video-photo-gallery-files/interfaces/video-photo-gallery-files.interface";

export interface VideoPhotoGalleryInterface {
  id?: number;
  name: string;
  theme: string;
  description: string;
  user_id: number;
  videoPhotoGalleryFiles?: VideoPhotoGalleryFilesInterface[];
}
