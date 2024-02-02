import { Injectable } from "@nestjs/common";
import { UsersServiceDb } from "../../../../db/users/users.service";

@Injectable()
export class PartnersService {
  constructor(private usersServiceDb: UsersServiceDb) {};

  async getPartners(adminId: number) {
    const serializedData = JSON.parse(JSON.stringify(await this.usersServiceDb.getUsers()));

    return serializedData.map(el => {

      if(el.id !== adminId) {
        delete el.password;

        return el;
      }
    }).filter(el => el !== undefined);
  }
}
