import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Users} from "./users.entity";
import {EntityRepository} from "@mikro-orm/core";
import { UserInterface } from "./interfaces/user.interface";

@Injectable()
export class UsersServiceDb {
    constructor(@InjectRepository(Users) private usersRepository: EntityRepository<Users>) {}

    async getUserByName(name: string) {
        return await this.usersRepository.findOne({ name: name });
    }
    async getUserById(id: number) {
        return await this.usersRepository.findOne({ id: id });
    }
    async getUsers() {
        return await this.usersRepository.find({  });
    }
    async createUser(user: UserInterface) {
        await this.usersRepository.nativeInsert(user);
    }
    async deleteUserById(id: number) {
        await this.usersRepository.nativeDelete({ id: id });
    }
    async updateUserNameById(name: string, id: number) {
        await this.usersRepository.nativeUpdate({ id: id }, { name: name });
    }
    async updateUserPasswordById(password: string, id: number) {
        await this.usersRepository.nativeUpdate({ id: id }, { password: password });
    }
}
