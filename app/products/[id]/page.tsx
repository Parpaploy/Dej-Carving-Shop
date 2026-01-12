import React from "react";
import axios from "axios";
import { IProduct } from "@/app/interfaces/product.interface";
import ProductDetailClient from "../../components/clients/productDetail";

// 1. Fetch Function (No changes needed here)
async function getProduct(id: string): Promise<IProduct | null> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products/${id}?populate=*`
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// 2. The Server Component
// UPDATE: params is now a Promise<{ id: string }>
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailServer({ params }: Props) {
  
  // ✅ FIX: You must await params before accessing properties
  const { id } = await params;

  // Fetch the data using the resolved ID
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-[#4B3621]">
        <h1 className="text-4xl font-serif font-bold mb-4">Item Not Found</h1>
        <p className="text-lg">This collectible may have been removed.</p>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}