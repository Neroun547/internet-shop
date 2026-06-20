import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Users} from "./users.entity";
import {EntityRepository, IsolationLevel} from "@mikro-orm/core";
import { UserInterface } from "./interfaces/user.interface";
import { UsersMapper } from "./users.mapper";
import { Settings } from "../settings/settings.entity";

@Injectable()
export class UsersServiceDb {
    constructor(@InjectRepository(Users) private usersRepository: EntityRepository<Users>) {}

    async getUserByName(name: string): Promise<UserInterface | null> {
        const data = await this.usersRepository.findOne({ name: name });

        if(!data) {
            return null;
        }
        return UsersMapper.toDomain(data);
    }
    async getUserById(id: number): Promise<UserInterface | null> {
        const data = await this.usersRepository.findOne({ id: id });

        if(!data) {
            return null;
        }
        return UsersMapper.toDomain(data);
    }
    async getUsers(): Promise<UserInterface[]> {
        const data = await this.usersRepository.find({  });

        return data.map(item => UsersMapper.toDomain(item));
    }
    async createUser(user: UserInterface): Promise<void> {
        await this.usersRepository.insert(UsersMapper.toPersist(user));
    }
    deleteUserByIdTransaction(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.usersRepository.getEntityManager().transactional(async em => {
                try {
                    const usersRepository = em.getRepository(Users);
                    const settingsRepository = em.getRepository(Settings);

                    await settingsRepository.nativeDelete({ setting_key: `user_setting.push_message.email.${id}` });
                    await settingsRepository.nativeDelete({ setting_key: `user_setting.push_message.is_email_notification_enabled.${id}` });

                    await usersRepository.nativeDelete({ id: id });

                    resolve();
                } catch(error) {
                    reject(error);
                }   
            }, { isolationLevel: IsolationLevel.REPEATABLE_READ });
        });    
    }
    async updateUserNameById(name: string, id: number): Promise<void> {
        await this.usersRepository.nativeUpdate({ id: id }, { name: name });
    }
    async updateUserPasswordById(password: string, id: number): Promise<void> {
        await this.usersRepository.nativeUpdate({ id: id }, { password: password });
    }
}
