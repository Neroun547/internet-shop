import {IsString, Length} from "class-validator";

export class SaveArticleDto {
    @IsString()
    @Length(1)
    content: string;

    @IsString()
    @Length(1)
    authors: string;

    @IsString()
    @Length(1, 255)
    name: string;

    @IsString()
    @Length(1, 255)
    theme: string;
}
