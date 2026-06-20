import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UsersServiceDb } from "../../../db/users/users.service";
import { CommonService } from "../../../common/common.service";
import * as argon from "argon2";
import { OrdersServiceDb } from "../../../db/orders/orders.service";
import { VideoPhotoGalleryServiceDb } from "../../../db/video-photo-gallery/video-photo-gallery.service";
import {
  VideoPhotoGalleryFilesServiceDb
} from "../../../db/video-photo-gallery-files/video-photo-gallery-files.service";
import { ArticlesServiceDb } from "../../../db/articles/articles.service";
import { ProductsServiceDb } from "../../../db/products/products.service";
import { ProductsImagesServiceDb } from "../../../db/products-images/products-images.service";
import { unlink } from "fs/promises";

const Moment = require("moment");

Moment.locale("uk");

@Injectable()
export class PartnersService {
  constructor(
    private usersServiceDb: UsersServiceDb,
    private commonService: CommonService,
    private ordersServiceDb: OrdersServiceDb,
    private videoPhotoGalleryServiceDb: VideoPhotoGalleryServiceDb,
    private videoPhotoGalleryFilesServiceDb: VideoPhotoGalleryFilesServiceDb,
    private articlesServiceDb: ArticlesServiceDb,
    private productsServiceDb: ProductsServiceDb,
    private productsImagesServiceDb: ProductsImagesServiceDb
  ) {};

  deleteFile(path: string) {
    try {
      unlink(path);
    } catch(error) {
      console.log("Delete file error:", error);
    }
  }

  async getPartners(adminId: number) {
    const serializedData = await this.usersServiceDb.getUsers();

    return serializedData.map(el => {

      if(el.id !== adminId) {
        return { ...el, password: undefined };
      }
    }).filter(el => el !== undefined);
  }
  async createPartner(name: string, password: string): Promise<void> {
    const userWithTheSameName = await this.usersServiceDb.getUserByName(name);

    if(userWithTheSameName) {
      throw new BadRequestException({ message: "Користувач з таким ім'ям вже існує" });
    }
    const passwordHash = await argon.hash(password);

    await this.usersServiceDb.createUser({ name: name, password: passwordHash, role: "partner" });
  }
  async deletePartnerById(id: number) {
    const productsAndImages = await this.productsServiceDb.getAllProductsAndImagesByUserId(id);

    for(const product of productsAndImages) {
      if(product.productsImages) {
        for(const productImage of product.productsImages) {
          if(productImage) {
            this.deleteFile("static/images/" + productImage.file_name);
          }
        }
      }
      if(product && product.id) {
        await this.productsImagesServiceDb.deleteProductImagesByProductId(product.id);
      }
    }
    const videoPhotoPublicationsAndFiles = await this.videoPhotoGalleryServiceDb.getPublicationAndFilesByUserId(id);

    for(const videoPhotoPublication of videoPhotoPublicationsAndFiles) {
      if(videoPhotoPublication.videoPhotoGalleryFiles) {
        for(const file of videoPhotoPublication.videoPhotoGalleryFiles) {
          this.deleteFile("static/images/" + file.file_name);
        }
        if(videoPhotoPublication.id) {
          await this.videoPhotoGalleryFilesServiceDb.deleteByVideoPhotoGalleryId(videoPhotoPublication.id);
        }
      }
    }
    const articles = await this.articlesServiceDb.getAllArticlesByUserId(id);

    for(let i = 0; i < articles.length; i++) {
      this.deleteFile(articles[i].filename);
    }
    try {
      await this.usersServiceDb.deleteUserByIdTransaction(id);
    } catch(error) {
      console.log("Transaction failed:", error);

      throw new InternalServerErrorException({ message: "Невдалося видалити партнера." });
    }
  }
  async getPartnerById(id: number) {
    const data = await this.usersServiceDb.getUserById(id);

    if(!data) {
      throw new NotFoundException();
    }
    return data;
  }
  async updatePartnerById(id: number, name: string, password: string) {
    if(!password && name) {
      await this.usersServiceDb.updateUserNameById(name, id);
    } else if(password && !name) {
      const passwordHash = await argon.hash(password);
      await this.usersServiceDb.updateUserPasswordById(passwordHash, id);
    } else {
      const passwordHash = await argon.hash(password);

      await this.usersServiceDb.updateUserNameById(name, id);
      await this.usersServiceDb.updateUserPasswordById(passwordHash, id);
    }
  }

  async generateNewPasswordById(id: number) {
    const newPassword = this.commonService.generateRandomPassword();
    const newPasswordHash = await argon.hash(newPassword);

    await this.usersServiceDb.updateUserPasswordById(newPasswordHash, id);

    return newPassword;
  }

  async parseOrder(order) {
    const products = await this.ordersServiceDb.getProductsByOrderIdAndUserId(order.id_order, order.user_id);
    
    return {
      // @ts-ignore
      sum: products.reduce((previousValue, currentValue) => previousValue + currentValue.product.price, 0),
      status: order.status,
      created_at: new Moment(order.created_at).format("LLLL")
    }
  }

  async getOrdersByUserId(userId: number, take: number, skip: number) {
    const orders = await this.ordersServiceDb.getOrdersByUserId(take, skip, userId);

    return await Promise.all(orders.map(async (order) => await this.parseOrder({...order, user_id: userId })));
  }
}
