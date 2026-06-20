import { Collection } from "@mikro-orm/core";
import {Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/decorators/legacy";
import { Articles } from "../articles/articles.entity";
import { Orders } from "../orders/orders.entity";
import { Products } from "../products/products.entity";
import { VideoPhotoGallery } from "../video-photo-gallery/video-photo-gallery.entity";

@Entity()
export class Users {
    @PrimaryKey({ type: "integer" })
    id: number;

    @Property({ nullable: false, type: "varchar" })
    name: string;

    @Property({ nullable: false, type: "varchar" })
    password: string;

    @Property({ type: "varchar" })
    role: "admin" | "partner";

    @OneToMany({ entity: () => Articles, mappedBy: "user" })
    articles: Collection<Articles>;

    @OneToMany({ entity: () => Orders, mappedBy: "user" })
    orders: Collection<Orders>;

    @OneToMany({ entity: () => Products, mappedBy: "user" })
    products: Collection<Products>;

    @OneToMany({ entity: () => VideoPhotoGallery, mappedBy: "user" })
    videoPhotoGallery: Collection<VideoPhotoGallery>;
}
