import { BlocksContent } from "@strapi/blocks-react-renderer";
import { Image } from "./interface";
import { IOrder } from "./order.interface";
import { ICategory } from "./category.interface";

export interface IProduct {
  id: number;
  createdAt: string;
  updatedAt?: string;
  images: Image[];
  name: string;
  description: BlocksContent;
  price: number;
  orders: IOrder[];
  categories?: ICategory[];
}
