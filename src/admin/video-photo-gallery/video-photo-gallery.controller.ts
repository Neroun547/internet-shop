import {
  BadRequestException,
  Body,
  Controller, Delete,
  Get, Param, ParseIntPipe, Patch,
  Post, Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { VideoPhotoGalleryServiceAdmin } from "./service/video-photo-gallery.service";
import { Response, Request } from "express";
import { AuthGuard } from "../auth/guards/auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UploadVideoPhotoDto } from "./dto/upload-video-photo.dto";

@Controller()
export class VideoPhotoGalleryController {
  constructor(private videoPhotoGalleryService: VideoPhotoGalleryServiceAdmin) {}

  @UseGuards(AuthGuard)
  @Delete(":id")
  async deletePublicationById(@Param("id", new ParseIntPipe()) id: number) {
    await this.videoPhotoGalleryService.deletePublicationById(id);

    return;
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 5, {
    fileFilter(req: any, file: { fieldname: string; originalname: string; encoding: string; mimetype: string; size: number; destination: string; filename: string; path: string; buffer: Buffer }, callback: (error: (Error | null), acceptFile: boolean) => void) {
      if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg" && file.mimetype !== "image/png" && file.mimetype !== "video/mp4" && file.mimetype !== "video/quicktime") {
        callback(new BadRequestException(), false);

        return;
      }
      callback(null, true);
    }
  }))
  async uploadVideoPhoto(@Req() req: Request, @Body() body: UploadVideoPhotoDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    if(!files.length) {
      throw new BadRequestException();
    }
    await this.videoPhotoGalleryService.savePublication(body, files, req["user"].id);

    return;
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  @UseInterceptors(FilesInterceptor('files', 5, {
    fileFilter(req: any, file: { fieldname: string; originalname: string; encoding: string; mimetype: string; size: number; destination: string; filename: string; path: string; buffer: Buffer }, callback: (error: (Error | null), acceptFile: boolean) => void) {
      if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg" && file.mimetype !== "image/png" && file.mimetype !== "video/mp4" && file.mimetype !== "video/quicktime") {
        callback(new BadRequestException(), false);

        return;
      }
      callback(null, true);
    }
  }))
  async editPublicationById(
    @Param("id", new ParseIntPipe()) id: number,
    @Req() req: Request,
    @Body() body: UploadVideoPhotoDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    await this.videoPhotoGalleryService.editPublicationById(id, body, files, req["user"].id);

    return;
  }
}
