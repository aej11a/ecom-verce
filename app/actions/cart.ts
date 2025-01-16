"use server";

import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

type CartItem = {
  productId: number;
  quantity: number;
};

export async function getCart(): Promise<CartItem[]> {
  const cartId = await getOrCreateCartId();
  const cart = (await kv.get<CartItem[]>(cartId)) || [];
  return cart;
}

export async function addToCart(
  productId: number,
  quantity: number = 1
): Promise<void> {
  const cartId = await getOrCreateCartId();
  const cart = await getCart();

  const existingItemIndex = cart.findIndex(
    (item) => item.productId === productId
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  await kv.set(cartId, cart);
}

export async function updateCartItemQuantity(
  productId: number,
  quantity: number
): Promise<void> {
  const cartId = await getOrCreateCartId();
  const cart = await getCart();

  const updatedCart = cart
    .map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    )
    .filter((item) => item.quantity > 0);

  await kv.set(cartId, updatedCart);
}

export async function removeFromCart(productId: number): Promise<void> {
  const cartId = await getOrCreateCartId();
  const cart = await getCart();

  const updatedCart = cart.filter((item) => item.productId !== productId);

  await kv.set(cartId, updatedCart);
}

async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies();
  let cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    cartId = uuidv4();
    cookieStore.set("cartId", cartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return cartId;
}
