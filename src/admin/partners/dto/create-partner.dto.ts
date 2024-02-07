import { IsString, Length } from "class-validator";

export class CreatePartnerDto {
  @IsString()
  @Length(1, 50, { message: "Ім'я повинно містити від 1 до 50 символів" })
  name: string;
}
