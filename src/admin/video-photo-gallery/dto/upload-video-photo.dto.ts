import { IsString, Length } from "class-validator";

export class UploadVideoPhotoDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 255)
  theme: string;

  @IsString()
  @Length(1, 1000)
  description: string;
}
