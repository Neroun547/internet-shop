export function getUserIdFromEntity(entity: { [key: string]: any }): number | undefined {
    return entity.user_id ? entity.user_id : (typeof entity.user === "number" ? entity.user : (entity.user ? entity.user.id : undefined));
}

export function getRubricIdFromEntity(entity: { [key: string]: any }): number | undefined {
    return entity.rubric_id ? entity.rubric_id : (typeof entity.rubric === "number" ? entity.rubric : (entity.rubric ? entity.rubric.id : undefined));
}

export function getProductIdFromEntity(entity: { [key: string]: any }): number | undefined {
    return entity.product_id ? entity.product_id : (typeof entity.product === "number" ? entity.product : (entity.product ? entity.product.id : undefined));
}

export function getVideoPhotoGalleryIdFromEntity(entity: { [key: string]: any }): number | undefined {
    return entity.video_photo_gallery_id ? entity.video_photo_gallery_id : (typeof entity.videoPhotoGallery === "number" ? entity.videoPhotoGallery : (entity.videoPhotoGallery ? entity.videoPhotoGallery.id : undefined));
}

