import React from "react";
import axios from "axios";
import { IProduct } from "@/app/interfaces/product.interface";
import ProductDetailClient from "../../components/clients/productDetail";

// 1. Fetch Function: Asks Strapi for ONE product by ID
async function getProduct(id: string): Promise<IProduct | null> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products/${id}?populate=*`
    );
    // Strapi response structure: data.data is the actual object
    return res.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// 2. The Server Component
// Next.js automatically gives us 'params' which contains the URL ID
export default async function ProductDetailServer({ params }: { params: { id: string } }) {
  
  // Fetch the data before rendering
  const product = await getProduct(params.id);

  // If product doesn't exist (wrong ID), show error
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-[#4B3621]">
        <h1 className="text-4xl font-serif font-bold mb-4">Item Not Found</h1>
        <p className="text-lg">This collectible may have been removed.</p>
      </div>
    );
  }

  // ✅ CORRECT: Pass the fetched data to the Client Component
  return <ProductDetailClient product={product} />;
}