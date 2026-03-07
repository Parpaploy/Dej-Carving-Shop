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
  status?: string;
  recipientName: string;
  phone: string;
  shippingAddress: string;
  paymentMethod: "bank_transfer" | "promptpay";
  user: IUser;
  products: IProduct[];
  tracking: ITracking;
}
