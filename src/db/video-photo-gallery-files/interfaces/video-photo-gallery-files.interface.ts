import { VideoPhotoGalleryInterface } from "src/db/video-photo-gallery/interfaces/video-photo-gallery.interface";

export interface VideoPhotoGalleryFilesInterface {
  id?: number;
  file_name: string;
  video_photo_gallery_id: number;
  video_photo_gallery?: number | VideoPhotoGalleryInterface;
}
