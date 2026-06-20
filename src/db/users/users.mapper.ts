import { Loaded } from "@mikro-orm/core";
import { Users } from "./users.entity";
import { UserInterface } from "./interfaces/user.interface";

export class UsersMapper {
    static toDomain(entity: Loaded<Users>): UserInterface {
        return {
            id: entity.id,
            name: entity.name,
            password: entity.password,
            role: entity.role
        }
    }

    static toPersist(params: UserInterface): Users {
        const model = new Users();

        for(let key in params) {
            model[key] = params[key];
        }
        return model;
    }
}

