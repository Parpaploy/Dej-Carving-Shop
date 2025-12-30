import { IOrder } from "./order.interface";

export interface ITracking {
  id: number;
  trackingNumber: string;
  order: IOrder;
}
