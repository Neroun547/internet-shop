import { IsArray, IsInt, IsString, Length } from "class-validator";

export class UpdateRubricDto {
  @IsInt()
  id: number;

  @IsArray()
  rubricTypes: Array<string>;

  @IsString()
  @Length(1, 255)
  name: string;
}
