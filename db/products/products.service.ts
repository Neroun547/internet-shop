import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Products} from "./products.entity";
import {EntityRepository} from "@mikro-orm/core";
import {ProductsInterface} from "./interfaces/products.interface";

@Injectable()
export class ProductsServiceDb {
    constructor(@InjectRepository(Products) private repository: EntityRepository<Products>) {}

    async saveProductAndReturn(product: ProductsInterface) {
        const productModel = new Products();

        productModel.name = product.name;
        productModel.description = product.description;
        productModel.available = product.available;
        productModel.price = product.price;
        productModel.type = product.type;
        productModel.num = product.num;
        productModel.user_id = product.user_id;
        productModel.rubric_id = product.rubric_id;

        await this.repository.persistAndFlush(productModel);

        return productModel;
    }

    async getProductById(id: number) {
        return await this.repository.findOne({ id: id });
    }
    async getProductAndImagesById(id: number) {
        return await this.repository.findOne({ id: id }, { populate: ["productsImages"] });
    }

    async getProductsAndImagesByType(take: number, skip: number, type: string, productName?: string) {
        if(productName) {
            return await this.repository.find({ type: type, name: { $like: "%" + productName + "%" } }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        } else {
            return await this.repository.find({ type: type }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        }
    }
    async getProductsAndImages(take: number, skip: number, productName?: string) {
        if(productName) {
            return await this.repository.find({ name: { $like: "%" + productName + "%" } }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        } else {
            return await this.repository.find({  }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        }
    }
    async getProductsAndImagesByUserId(take: number, skip: number, userId: number) {
        return await this.repository.find({ user_id: userId }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
    }
    async deleteProductById(id: number) {
        await this.repository.nativeDelete( { id: id });
    }
    async updateProductById(id: number, product: ProductsInterface) {
        await this.repository.nativeUpdate({ id: id }, product);
    }
    async getCountAvailableProductsByUserId(userId: number) {
        return await this.repository.count({ user_id: userId, available: true });
    }
    async getCountProductsByUserId(userId: number) {
        return await this.repository.count({ user_id: userId });
    }
    async getLastProductByNumAndByUserId(userId: number) {
        return (await this.repository.find({ user_id: userId }, { orderBy: { num: "DESC" }, limit: 1 }))[0];
    }
    async getProductByIdAndUserId(id: number, userId: number) {
        return await this.repository.findOne({ id: id, user_id: userId });
    }
    async updateProductsNumToPrev(num: number) {
        await this.repository.nativeUpdate({ num: num + 1 }, { num });
    }
    async getCountProductsBiggerNum(num: number) {
        return await this.repository.count({ num: { $gt: num } });
    }
    async getMaxPriceProductsByType(type: string) {
        const data = (await this.repository.find({ type: type }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMinPriceProductsByType(type: string) {
        const data = (await this.repository.find({ type: type }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMaxPriceProducts() {
        const data = (await this.repository.find({ }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMaxPriceProductsByUserId(userId: number) {
        const data = (await this.repository.find({ user_id: userId }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMinPriceProducts() {
        const data = (await this.repository.find({  }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMinPriceProductsByUserId(userId: number) {
        const data = (await this.repository.find({ user_id: userId }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getProductsAndImagesByFilters(take: number, skip: number, priceFrom: number, priceTo: number, type: string, available?: undefined | boolean, productName?: string) {

        if(available !== undefined) {
            if(type) {
                if(productName) {
                    return await this.repository.find({
                        price: {
                            $gte: priceFrom,
                            $lte: priceTo
                        }, available: available, type: type, name: { $like: "%" + productName + "%" }
                    }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
                } else {
                    return await this.repository.find({
                        price: {
                            $gte: priceFrom,
                            $lte: priceTo
                        }, available: available, type: type,
                    }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
                }
            }
            if(productName) {
                return await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, available: available, name: { $like: "%" + productName + "%" }
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
            } else {
                return await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, available: available
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
            }
        } else {
            if(type) {
                if(productName) {
                    return await this.repository.find({
                        price: {
                            $gte: priceFrom,
                            $lte: priceTo
                        }, type: type, name: { $like: "%" + productName + "%" }
                    }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
                } else {
                    return await this.repository.find({
                        price: {
                            $gte: priceFrom,
                            $lte: priceTo
                        }, type: type
                    }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
                }
            }
            if(productName) {
                return await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, name: { $like: "%" + productName + "%" }
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
            } else {
                return await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
            }
        }
    }
    async getProductsAndImagesByFiltersAndUserId(take: number, skip: number, priceFrom: number, priceTo: number, type: string, userId: number, available?) {
        if(available !== undefined) {
            if(type) {
                return await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, available: available, type: type, user_id: userId
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
            }
            return await this.repository.find({
                price: {
                    $gte: priceFrom,
                    $lte: priceTo
                }, available: available, user_id: userId
            }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
        } else {
            if(type) {
                return await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, type: type, user_id: userId
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
            }
            return await this.repository.find({
                price: {
                    $gte: priceFrom,
                    $lte: priceTo
                }, user_id: userId
            }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
        }
    }
    async getProductByNumAndUserId(num: number, userId: number) {
        return await this.repository.findOne({ num: num, user_id: userId });
    }

    async getProductsAndImagesByTypeAndUserId(take: number, skip: number, type: string, userId: number) {
        return await this.repository.find({ type: type, user_id: userId }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
    }

    async getAllProductsAndImagesByUserId(userId: number) {
        return await this.repository.find({ user_id: userId }, { populate: ["productsImages"] });
    }
    async deleteProductsByUserId(userId: number) {
        await this.repository.nativeDelete({ user_id: userId });
    }
    async getProductsAndImagesByRubricId(rubricId: number, take: number, skip: number, productName?: string) {
        if(productName) {
            return await this.repository.find({ rubric_id: rubricId, name: { $like: "%" + productName + "%" } }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        } else {
            return await this.repository.find({ rubric_id: rubricId }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        }
    }

    async getMaxPriceProductsByRubricId(rubricId: number) {
        const data = (await this.repository.find({ rubric_id: rubricId }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }

    async getMinPriceProductsByRubricId(rubricId: number) {
        const data = (await this.repository.find({ rubric_id: rubricId }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }

  async getProductsAndImagesByFiltersAndRubricId(take: number, skip: number, priceFrom: number, priceTo: number, type: any, available: boolean, rubricId: number, productName?: string) {
      if(available !== undefined) {
          if(type) {
              if(productName) {
                  return await this.repository.find({
                      rubric_id: rubricId,
                      price: {
                          $gte: priceFrom,
                          $lte: priceTo
                      }, available: available, type: type, name: { $like: "%" + productName + "%" }
                  }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
              } else {
                  return await this.repository.find({
                      rubric_id: rubricId,
                      price: {
                          $gte: priceFrom,
                          $lte: priceTo
                      }, available: available, type: type
                  }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
              }
          }
          if(productName) {
              return await this.repository.find({
                  rubric_id: rubricId,
                  price: {
                      $gte: priceFrom,
                      $lte: priceTo
                  }, available: available, name: { $like: "%" + productName + "%" }
              }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
          } else {
              return await this.repository.find({
                  rubric_id: rubricId,
                  price: {
                      $gte: priceFrom,
                      $lte: priceTo
                  }, available: available
              }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
          }
      } else {
          if(type) {
              if(productName) {
                  return await this.repository.find({
                      rubric_id: rubricId,
                      price: {
                          $gte: priceFrom,
                          $lte: priceTo
                      }, type: type, name: { $like: "%" + productName + "%" }
                  }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
              } else {
                  return await this.repository.find({
                      rubric_id: rubricId,
                      price: {
                          $gte: priceFrom,
                          $lte: priceTo
                      }, type: type
                  }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
              }
          }
          if(productName) {
              return await this.repository.find({
                  rubric_id: rubricId,
                  price: {
                      $gte: priceFrom,
                      $lte: priceTo
                  }, name: { $like: "%" + productName + "%" }
              }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
          } else {
              return await this.repository.find({
                  rubric_id: rubricId,
                  price: {
                      $gte: priceFrom,
                      $lte: priceTo
                  }
              }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
          }
      }
  }
  async deleteProductsByRubricId(rubricId: number) {
        await this.repository.nativeDelete({ rubric_id: rubricId });
  }

  async getProductsByRubricId(rubricId: number) {
        return await this.repository.find({ rubric_id: rubricId });
  }

  async getProductsAndImagesLikeName(take: number, skip: number, name: string) {
        return await this.repository.find({ name: { $like: "%" + name + "%" } }, { populate: ["productsImages"], offset: skip, limit: take });
  }

  async getMaxPriceProductsLikeName(name: string): Promise<number | null> {
        const data = (await this.repository.find({ name: { $like: "%" + name + "%" } }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
  }

    async getMinPriceProductsLikeName(name: string) {
        const data = (await this.repository.find({ name: { $like: "%" + name + "%" } }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }

    async getProductsAndImagesByFiltersAndAdminId(take: number, skip: number, priceFrom: number, priceTo: number, type: string, adminId: number, available: boolean | undefined) {
        if(available === undefined) {
            if(type) {
                return await this.repository.find({ price: { $gte: priceFrom, $lte: priceTo }, type: type, user_id: adminId }, { offset: skip, limit: take, populate: ["productsImages"], orderBy: {num: "ASC"} });
            } else {
                return await this.repository.find({ price: { $gte: priceFrom, $lte: priceTo }, user_id: adminId }, { offset: skip, limit: take, populate: ["productsImages"], orderBy: {num: "ASC"} });
            }
        } else {
            if(type) {
                return await this.repository.find({ price: { $gte: priceFrom, $lte: priceTo }, type: type, user_id: adminId, available: available }, { offset: skip, limit: take, populate: ["productsImages"], orderBy: {num: "ASC"} });
            } else {
                return await this.repository.find({ price: { $gte: priceFrom, $lte: priceTo }, user_id: adminId, available: available }, { offset: skip, limit: take, populate: ["productsImages"], orderBy: {num: "ASC"} });
            }
        }
    }
}
