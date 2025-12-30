import { IProduct } from "./product.interface";
import { ITracking } from "./tracking.interface";
import { IUser } from "./user.interface";

export interface IOrder {
  id: number;
  createdAt: string;
  updatedAt?: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  users: IUser;
  products: IProduct[];
  tracking: ITracking;
}
