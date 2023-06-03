import {Entity, ManyToOne, OneToOne} from "@mikro-orm/core";
import { PrimaryKey } from "@mikro-orm/core";
import { SupportChatUsers } from "./support-chat-users/support-chat-users.entity";

@Entity()
export class SupportChats {
    @PrimaryKey()
    id: number;

    @OneToOne(() => SupportChatUsers)
    support_chat_user: SupportChatUsers | number;
}
