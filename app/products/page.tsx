import React from "react";
import axios from "axios";
import ProductsClient from "../components/clients/products";
import { IProduct } from "@/app/interfaces/product.interface";

async function getProducts(categorySlug?: string): Promise<IProduct[]> {
  try {
    let url = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?populate=*`;
    if (categorySlug) {
      url += `&filters[category][slug][$eq]=${encodeURIComponent(categorySlug)}`;
    }
    const res = await axios.get(url);
    return res.data.data || [];
  } catch (error) {
    console.error("Build Error: Failed to fetch products", error);
    return [];
  }
}

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const products = await getProducts(category);

  return <ProductsClient products={products} activeCategory={category} />;
}
