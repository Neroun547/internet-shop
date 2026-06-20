import { Loaded } from "@mikro-orm/core";
import { RubricsTypes } from "./rubrics-types.entity";
import { RubricsTypesInterface } from "./interfaces/rubrics-types.interface";
import { getRubricIdFromEntity } from "src/common/utils";

export class RubricTypesMapper {
    static toDomain(entity: Loaded<RubricsTypes>): RubricsTypesInterface {
        return {
            id: entity.id,
            name: entity.name,
            rubric_id: getRubricIdFromEntity(entity) ?? 0
        }
    }

    static toPersist(params: {   
        id?: number;
        name: string;
        rubric_id: number; 
        rubric: number;
    }): RubricsTypes {
        const newModel = new RubricsTypes();

        for(let key in params) {
            newModel[key] = params[key];
        }
        return newModel;
    }
}

