import { Suspense } from "react";
import CartContents from "@/components/CartContents";
import { CartContentsSkeleton } from "@/components/CartContentsSkeleton";

export default function CartPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <Suspense fallback={<CartContentsSkeleton />}>
        <CartContents />
      </Suspense>
    </div>
  );
}
