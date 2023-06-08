import {IsString, Length} from "class-validator";

export class AddAdminNoteDto {
    @IsString()
    @Length(0, 255)
    note: string;
}
