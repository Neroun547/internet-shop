import { Module } from "@nestjs/common";
import { MailerModule } from "src/mailer/mailer.module";
import { NotificationsService } from "./notifications.service";
import { SettingsModuleDb } from "src/db/settings/settings.module";

@Module({
    imports: [MailerModule, SettingsModuleDb],
    providers: [NotificationsService],
    exports: [NotificationsService]
})
export class NotificationsModule {}

