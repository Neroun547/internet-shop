import {Entity, PrimaryKey, Property} from "@mikro-orm/decorators/legacy";
import {SupportChats} from "../support-chats.entity";
import {SupportChatMessagesInterface} from "./interfaces/support-chat-messages.interface";

@Entity()
export class SupportChatMessages implements SupportChatMessagesInterface {
    @PrimaryKey({ type: "integer" })
    id: number;

    @Property({ type: "text" })
    message: string;

    @Property({ type: "bool" })
    admin: boolean;

    @Property({ type: "integer" })
    chat: SupportChats | number;

    @Property({ type: "datetime" })
    date: string | Date;
}
