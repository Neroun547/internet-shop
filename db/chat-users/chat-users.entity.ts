import {ChatUsersInterface} from "./interfaces/chat-users.interface";
import {Entity, PrimaryKey, Property} from "@mikro-orm/core";

@Entity()
export class ChatUsers implements ChatUsersInterface {
    @PrimaryKey()
    id: number;

    @Property()
    username: string;

    @Property()
    password: string;
}
