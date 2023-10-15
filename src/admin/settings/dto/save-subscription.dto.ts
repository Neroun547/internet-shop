import { IsBoolean, IsString } from "class-validator";

export class SaveSubscriptionDto {
  @IsString()
  data: string;

  @IsBoolean()
  active: boolean;
}
