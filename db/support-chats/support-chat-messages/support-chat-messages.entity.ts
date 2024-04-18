import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {SupportChats} from "../support-chats.entity";
import {SupportChatMessagesInterface} from "./interfaces/support-chat-messages.interface";

@Entity()
export class SupportChatMessages implements SupportChatMessagesInterface {
    @PrimaryKey()
    id: number;

    @Property()
    message: string;

    @Property()
    admin: boolean;

    @Property()
    chat: SupportChats | number;

    @Property()
    date: string | Date;
}
