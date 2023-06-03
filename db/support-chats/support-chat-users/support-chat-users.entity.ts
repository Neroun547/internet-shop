import {SupportChatUsersInterface} from "./interfaces/support-chat-users.interface";
import {Entity, OneToOne, PrimaryKey, Property} from "@mikro-orm/core";

@Entity()
export class SupportChatUsers implements SupportChatUsersInterface {
    @PrimaryKey()
    id: number;

    @Property()
    username: string;

    @Property()
    password: string;
}
