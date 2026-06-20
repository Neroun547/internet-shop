import {Entity, PrimaryKey, Property} from "@mikro-orm/decorators/legacy";

@Entity()
export class Statistics {
    @PrimaryKey({ type: "integer" })
    id: number;

    @Property({ type: "varchar" })
    user: string;

    @Property({ type: "datetime" })
    date: Date | string;

    @Property({ type: "tinytext" })
    country_code: string;
}

