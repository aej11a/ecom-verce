"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
} from "@/app/actions/cart";
import { getProductsByIds } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type CartItem = {
  productId: number;
  quantity: number;
};

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  sku: string;
};

export default function CartContents() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartItems = await getCart();
        setCart(cartItems);
        if (cartItems.length > 0) {
          const productIds = cartItems.map((item) => item.productId);
          const fetchedProducts = await getProductsByIds(productIds);
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast({
          title: "Error",
          description: "There was a problem loading your cart.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [toast]);

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    try {
      await updateCartItemQuantity(productId, newQuantity);
      setCart((prevCart) =>
        prevCart
          .map((item) =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "There was a problem updating the quantity.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await removeFromCart(productId);
      setCart((prevCart) =>
        prevCart.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "There was a problem removing the item from your cart.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <p>Loading cart...</p>;
  }

  if (cart.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4">Your cart is empty.</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? Number(product.price) * item.quantity : 0);
  }, 0);

  return (
    <div>
      {cart.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        return (
          <div key={item.productId} className="flex items-center border-b py-4">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              width={100}
              height={100}
              className="object-cover rounded"
            />
            <div className="ml-4 flex-grow">
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
            </div>
            <div className="flex items-center">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.productId, parseInt(e.target.value))
                }
                className="w-16 mr-2"
              />
              <Button
                variant="destructive"
                onClick={() => handleRemove(item.productId)}
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}
      <div className="mt-6 text-right">
        <p className="text-xl font-semibold">Total: ${total}</p>
        <Button className="mt-4">Proceed to Checkout</Button>
      </div>
    </div>
  );
}
