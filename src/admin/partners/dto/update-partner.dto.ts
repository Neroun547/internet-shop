import { IsOptional, IsString, Length } from "class-validator";

export class UpdatePartnerDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  password: string;
}
