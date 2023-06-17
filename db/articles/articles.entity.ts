import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {ArticlesInterface} from "./interfaces/articles.interface";

@Entity()
export class Articles implements ArticlesInterface {
    @PrimaryKey()
    id: number;

    @Property()
    authors: string;

    @Property()
    filename: string;

    @Property()
    created_at: string | Date;
}

