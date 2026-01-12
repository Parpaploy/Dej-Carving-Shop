import React from "react";
import axios from "axios";
import ProductsClient from "../components/clients/products"; // Check your import path
import { IProduct } from "@/app/interfaces/product.interface";

// 1. Safe Fetch Function
async function getProducts(): Promise<IProduct[]> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?populate=*`
    );
    // Return the data array, or an empty array if data is missing
    return res.data.data || [];
  } catch (error) {
    console.error("Build Error: Failed to fetch products", error);
    // ⚠️ CRITICAL FIX: Return an empty array [] instead of null so .map() doesn't crash
    return [];
  }
}

export default async function ProductsPage() {
  // 2. Fetch data
  const products = await getProducts();

  // 3. Pass to Client Component (It is now guaranteed to be an array)
  return <ProductsClient products={products} />;
}