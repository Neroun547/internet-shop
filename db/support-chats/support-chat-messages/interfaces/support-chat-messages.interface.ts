import {SupportChats} from "../../support-chats.entity";

export interface SupportChatMessagesInterface {
    id?: number;
    admin: boolean;
    message: string;
    chat: SupportChats | number;
}
