import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersServiceDb } from "../../../../db/users/users.service";
import { CommonService } from "../../../../common/common.service";
import * as argon from "argon2";
import { OrdersServiceDb } from "../../../../db/orders/orders.service";
import { VideoPhotoGalleryServiceDb } from "../../../../db/video-photo-gallery/video-photo-gallery.service";
import {
  VideoPhotoGalleryFilesServiceDb
} from "../../../../db/video-photo-gallery-files/video-photo-gallery-files.service";
import { ArticlesServiceDb } from "../../../../db/articles/articles.service";
import { ProductsServiceDb } from "../../../../db/products/products.service";
import { ProductsImagesServiceDb } from "../../../../db/products-images/products-images.service";
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
    } catch {

    }
  }

  async getPartners(adminId: number) {
    const serializedData = JSON.parse(JSON.stringify(await this.usersServiceDb.getUsers()));

    return serializedData.map(el => {

      if(el.id !== adminId) {
        delete el.password;

        return el;
      }
    }).filter(el => el !== undefined);
  }
  async createPartner(name: string): Promise<string> {
    const userWithTheSameName = await this.usersServiceDb.getUserByName(name);

    if(userWithTheSameName) {
      throw new BadRequestException({ message: "Користувач з таким ім'ям вже існує" });
    }
    const password = this.commonService.generateRandomPassword();
    const passwordHash = await argon.hash(password);

    await this.usersServiceDb.createUser({ name: name, password: passwordHash, role: "partner" });

    return password;
  }
  async deletePartnerById(id: number) {
    await this.ordersServiceDb.deleteOrdersByUserId(id);

    const productsAndImages = await this.productsServiceDb.getAllProductsAndImagesByUserId(id);

    for(let i = 0; i < productsAndImages.length; i++) {
      for(let j = 0; j < productsAndImages[i].productsImages.length; j++) {
        this.deleteFile("static/images/" + productsAndImages[i].productsImages[j].file_name);
      }
      await this.productsImagesServiceDb.deleteProductImagesByProductId(productsAndImages[i].id);
    }
    await this.productsServiceDb.deleteProductsByUserId(id);

    const videoPhotoPublicationsAndFiles = await this.videoPhotoGalleryServiceDb.getPublicationAndFilesByUserId(id);

    for(let i = 0; i < videoPhotoPublicationsAndFiles.length; i++) {
      for(let j = 0; j < videoPhotoPublicationsAndFiles[i].videoPhotoGalleryFiles.length; j++) {
        this.deleteFile("static/images/" + videoPhotoPublicationsAndFiles[i].videoPhotoGalleryFiles[j].file_name);
      }
      await this.videoPhotoGalleryFilesServiceDb.deleteByVideoPhotoGalleryId(videoPhotoPublicationsAndFiles[i].id);
    }
    await this.videoPhotoGalleryServiceDb.deleteByUserId(id);

    const articles = await this.articlesServiceDb.getAllArticlesByUserId(id);

    for(let i = 0; i < articles.length; i++) {
      this.deleteFile(articles[i].filename);

      await this.articlesServiceDb.deleteArticleByFilename(articles[i].filename);
    }
    await this.usersServiceDb.deleteUserById(id);
  }
  async getPartnerById(id: number) {
    return await this.usersServiceDb.getUserById(id);
  }
  async updatePartnerNameById(id: number, name: string) {
    await this.usersServiceDb.updateUserNameById(name, id);
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
