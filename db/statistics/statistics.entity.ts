import {Entity, PrimaryKey, Property} from "@mikro-orm/core";

@Entity()
export class Statistics {
    @PrimaryKey()
    id: number;

    @Property()
    user: string;

    @Property()
    date: Date | string;

    @Property()
    country_code: string;
}

