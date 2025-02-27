import Image from "next/image";
import type { Product } from "@/types";
import PersonalizedDescription from "./PersonalizedDescription";
import { Suspense } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";

export default function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-xl text-gray-600 mb-4">{product.tagline}</p>
        <p className="text-2xl font-bold mb-4">${product.price}</p>
        <AddToCartButton productId={product.id} productName={product.name} />
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">Product Details</h2>
          <p className="mb-2">
            <span className="font-semibold">SKU:</span> {product.sku}
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>
        <Suspense fallback={null}>
          <PersonalizedDescription productId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}
