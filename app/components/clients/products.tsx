"use client";

import { IProduct } from "@/app/interfaces/product.interface";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export default function ProductsClient({ products }: { products: IProduct[] }) {
  console.log(products);

  return (
    <main className="w-full min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">Products</h1>

      {products.map((product, index) => (
        <div key={index}>
          <pre className="bg-gray-100 p-4 rounded">{product.name}</pre>
          <BlocksRenderer content={product.description} />
        </div>
      ))}
    </main>
  );
}
