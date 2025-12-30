import { GetProducts } from "@/api/services/product";
import ProductsClient from "../components/clients/products";
import { IProduct } from "../interfaces/product.interface";

export default async function ProductsServer() {
  const products: IProduct[] = await GetProducts();

  return <ProductsClient products={products} />;
}
