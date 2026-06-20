import {SupportChatUsersInterface} from "./interfaces/support-chat-users.interface";
import {Entity, PrimaryKey, Property} from "@mikro-orm/decorators/legacy";

@Entity()
export class SupportChatUsers implements SupportChatUsersInterface {
    @PrimaryKey({ type: "integer" })
    id: number;

    @Property({ type: "varchar" })
    username: string;

    @Property({ type: "varchar" })
    password: string;
}
