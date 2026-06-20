import { Injectable } from "@nestjs/common";
import { SettingsServiceDb } from "src/db/settings/settings.service";
import { MailerService } from "src/mailer/mailer.service";

@Injectable()
export class NotificationsService {
    constructor(private mailerService: MailerService, private settingsServiceDb: SettingsServiceDb) {}

    async pushOrderEmailNotificationsByUsersIds(
        userIds: Array<number>, 
        contactInfo: {                
            firstName: string; 
            lastName: string; 
            remark: string; 
            contactInfo: string;
        }
    ) {
        const promises: Array<Promise<void>> = [];
        
        for(const userId of userIds) {  
            const isEmailNotificationEnabledForUser = await this.settingsServiceDb.getSettingByKey(`user_setting.push_message.is_email_notification_enabled.${userId}`);

            if(isEmailNotificationEnabledForUser && isEmailNotificationEnabledForUser.setting_value === "true") {
                const recipientEmail = await this.settingsServiceDb.getSettingByKey(`user_setting.push_message.email.${userId}`);

                if(recipientEmail) {
                    promises.push(this.mailerService.sendMail({
                        to: recipientEmail.setting_value,
                        subject: "Нове замовлення",
                        html: `
                            <h4>У вас нове замовлення.</h4> 
                            <p>Інформація про клієнта:</p>
                            <ul>
                                <li>Ім'я: ${contactInfo.firstName}</li>
                                <li>Прізвище: ${contactInfo.lastName}</li>
                                <li>Примітка: ${contactInfo.remark} </li>
                                <li>Контактна інформація: ${contactInfo.contactInfo}</li> 
                            </ul>
                        `
                    }));   
                }
            }
        }
        await Promise.all(promises);
    }
}


