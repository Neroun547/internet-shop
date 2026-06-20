import {Entity, OneToOne, PrimaryKey} from "@mikro-orm/decorators/legacy";
import { SupportChatUsers } from "./support-chat-users/support-chat-users.entity";

@Entity()
export class SupportChats {
    @PrimaryKey({ type: "integer" })
    id: number;

    @OneToOne(() => SupportChatUsers)
    support_chat_user: SupportChatUsers;
}
