import { Loaded } from "@mikro-orm/core";
import { Rubrics } from "./rubrics.entity";
import { RubricsInterface } from "./interfaces/rubrics.interface";
import { RubricTypesMapper } from "../rubrics-types/rubric-types.mapper";

export class RubricsMapper {
    static toDomain(entity: Loaded<Rubrics>): RubricsInterface {
        return {
            id: entity.id,
            name: entity.name,
            selected_default: entity.selected_default
        }
    }
    static toDomainWithTypes(entity: Loaded<Rubrics, "rubricTypes", never, never>): RubricsInterface {
        return {
            id: entity.id,
            name: entity.name,
            selected_default: entity.selected_default,
            rubricTypes: entity.rubricTypes.map(item => RubricTypesMapper.toDomain(item))
        }
    }
    static toPersist(params: RubricsInterface): Rubrics {
        const newModel = new Rubrics();

        for(let key in params) {
            newModel[key] = params[key]
        }
        return newModel;
    }
}

