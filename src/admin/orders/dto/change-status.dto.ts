import {IsEnum} from "class-validator";
import {ChangeStatusEnum} from "../enums/change-status.enum";

export class ChangeStatusDto {
    @IsEnum(ChangeStatusEnum)
    status: string;
}
