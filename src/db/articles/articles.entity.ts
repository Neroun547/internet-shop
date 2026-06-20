import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/decorators/legacy";
import { Users } from "../users/users.entity";

@Entity()
export class Articles {
    @PrimaryKey({ type: "integer" })
    id: number;

    @Property({ type: "text" })
    authors: string;

    @Property({ type: "varchar" })
    filename: string;

    @Property({ type: "varchar" })
    created_at: string;

    @Property({ type: "varchar" })
    updated_at: string;

    @Property({ type: "varchar" })
    name: string;

    @Property({ type: "varchar" })
    theme: string;

    user_id: number;

    @ManyToOne(() => Users, { fieldName: "user_id", deleteRule: "cascade" })
    user: Users | number;
}

