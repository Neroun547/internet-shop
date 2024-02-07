import { IsString, Length } from "class-validator";

export class UpdatePartnerNameDto {
  @IsString()
  @Length(1, 50)
  name: string;
}
