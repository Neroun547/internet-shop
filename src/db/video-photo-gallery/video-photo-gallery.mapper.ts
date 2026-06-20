import { Loaded } from "@mikro-orm/core";
import { VideoPhotoGallery } from "./video-photo-gallery.entity";
import { VideoPhotoGalleryInterface } from "./interfaces/video-photo-gallery.interface";
import { VideoPhotoGalleryFilesMapper } from "../video-photo-gallery-files/video-photo-gallery-files.mapper";
import { getUserIdFromEntity } from "src/common/utils";

export class VideoPhotoGalleryMapper {
    static toDomain(entity: Loaded<VideoPhotoGallery>): VideoPhotoGalleryInterface {
        return {
            id: entity.id,
            name: entity.name,
            theme: entity.theme,
            description: entity.description,
            user_id: getUserIdFromEntity(entity) ?? 0    
        }
    }

    static toDomainWithFiles(entity: Loaded<VideoPhotoGallery, "videoPhotoGalleryFiles", "*">): VideoPhotoGalleryInterface {
        return {
            id: entity.id,
            videoPhotoGalleryFiles: entity.videoPhotoGalleryFiles.map(item => VideoPhotoGalleryFilesMapper.toDomain(item)),
            name: entity.name,
            theme: entity.theme,
            description: entity.description,
            user_id: getUserIdFromEntity(entity) ?? 0
        }
    }

    static toPersist(params: VideoPhotoGalleryInterface): VideoPhotoGallery {
        const model = new VideoPhotoGallery();

        for(let key in params) {
            model[key] = params[key];
        }
        model.user = params.user_id;

        return model;
    }
}

