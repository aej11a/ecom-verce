"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/app/actions/cart";
import { useToast } from "@/hooks/use-toast";

type AddToCartButtonProps = {
  productId: number;
  productName: string;
};

export function AddToCartButton({
  productId,
  productName,
}: AddToCartButtonProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(productId, 1);
      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "There was a problem adding the item to your cart.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAddingToCart}
      className="w-48 mb-4"
    >
      {isAddingToCart ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
