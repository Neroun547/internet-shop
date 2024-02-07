import { IsArray, IsString, Length } from "class-validator";

export class CreateRubricDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsArray()
  types: Array<string>;
}

