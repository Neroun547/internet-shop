import { IsBoolean, IsEmail, IsOptional } from "class-validator";

export class UpdateSettingsDto {
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsBoolean()
    isEmailNotificationEnabled: boolean;
}

