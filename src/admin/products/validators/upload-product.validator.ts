import { BadRequestException } from "@nestjs/common";
import { Request } from "express";

export function uploadProductFileValidator(req: Request, file: { fieldname: string; originalname: string; encoding: string; mimetype: string; size: number; destination: string; filename: string; path: string; buffer: Buffer }, callback: Function) {   
    if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg" && file.mimetype !== "image/png") {
        callback(new BadRequestException(), false);

        return;
    }
    const maxSize = process.env.PRODUCT_PHOTO_MAX_SIZE ? Number(process.env.PRODUCT_PHOTO_MAX_SIZE) : 20971520;

    if(file.size >= maxSize) {
        callback(new BadRequestException(), false);

        return;
    }
    callback(null, true);
}

