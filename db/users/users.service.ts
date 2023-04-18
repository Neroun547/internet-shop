import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Users} from "./users.entity";
import {EntityRepository} from "@mikro-orm/core";

@Injectable()
export class UsersServiceDb {
    constructor(@InjectRepository(Users) private usersRepository: EntityRepository<Users>) {}

    async getUserByName(name: string) {
        return await this.usersRepository.findOne({ name: name });
    }
}
