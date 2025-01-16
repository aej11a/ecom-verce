"use client";

import { useEffect, useState } from "react";
import { getCart } from "@/app/actions/cart";

export function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      const cart = await getCart();
      setCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    fetchCartCount();
  }, []);

  if (count === 0) return null;

  return (
    <span className="items-center justify-center leading-none transform translate-x-1/2rounded-full">
      {count}
    </span>
  );
}
