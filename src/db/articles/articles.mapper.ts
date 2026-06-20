import { Loaded } from "@mikro-orm/core";
import { Articles } from "./articles.entity";
import { ArticlesInterface } from "./interfaces/articles.interface";
import { getUserIdFromEntity } from "src/common/utils";

export class ArticlesMapper {
    static toDomain(entity: Loaded<Articles>): ArticlesInterface {
        return {
            id: entity.id,
            filename: entity.filename,
            authors: entity.authors,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            name: entity.name,
            theme: entity.theme,
            user_id: getUserIdFromEntity(entity) ?? 0
        }
    }
    static toPersist(data: ArticlesInterface): Articles {
        const newModel = new Articles();

        for(let key in data) {
            newModel[key] = data[key];
        }
        newModel.user = data.user_id;

        return newModel;
    }
}

