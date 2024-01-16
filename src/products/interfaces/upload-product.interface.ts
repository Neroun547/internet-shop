import { ProductsInterface } from "../../../db/products/interfaces/products.interface";

export interface UploadProductInterface extends ProductsInterface {
  translate: string;
  translate_language: string;
}
