import { Loaded } from "@mikro-orm/core";
import { SupportChatMessages } from "./support-chat-messages.entity";
import { SupportChatMessagesInterface } from "./interfaces/support-chat-messages.interface";

export class SupportChatMessagesMapper {
    static toDomain(entity: Loaded<SupportChatMessages>): SupportChatMessagesInterface {
        return {
            id: entity.id,
            admin: entity.admin,
            message: entity.message,
            chat: entity.chat,
            date: entity.date
        }
    }

    static toPersist(params: SupportChatMessagesInterface): SupportChatMessages {
        const model = new SupportChatMessages();

        for(let key in params) {
            model[key] = params[key];
        }
        return model;
    }
}

