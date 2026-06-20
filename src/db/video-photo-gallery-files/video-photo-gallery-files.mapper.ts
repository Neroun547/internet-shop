import { Loaded } from "@mikro-orm/core";
import { VideoPhotoGalleryFiles } from "./video-photo-gallery-files.entity";
import { VideoPhotoGalleryFilesInterface } from "./interfaces/video-photo-gallery-files.interface";
import { getVideoPhotoGalleryIdFromEntity } from "src/common/utils";

export class VideoPhotoGalleryFilesMapper {
    static toDomain(entity: Loaded<VideoPhotoGalleryFiles>): VideoPhotoGalleryFilesInterface {
        return {
            id: entity.id,
            file_name: entity.file_name,
            video_photo_gallery_id: getVideoPhotoGalleryIdFromEntity(entity) ?? 0
        }
    }

    static toPersist(params: VideoPhotoGalleryFilesInterface): VideoPhotoGalleryFiles {
        const model = new VideoPhotoGalleryFiles();

        for(let key in params) {
            model[key] = params[key];
        }
        return model;
    }
}

