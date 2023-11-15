import prisma from "./prisma";
import { cookies } from "next/dist/client/components/headers";
import { Cart, Prisma } from "@prisma/client";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export interface ShoppingCart extends CartWithProducts {
  size: number;
  subTotal: number;
}

export async function getCart(): Promise<ShoppingCart | null> {
  const localCartId = cookies().get("localCartId")?.value;
  const cart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: { include: { product: true } } },
      })
    : null;

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size:
      cart?.items.reduce((acc, cartItem) => acc + cartItem.quantity, 0) ?? 0,
    subTotal: cart?.items?.reduce(
      (acc, cartItem) => acc + cartItem.quantity * cartItem.product.price,
      0,
    ),
  };
}

export async function createCart(): Promise<ShoppingCart> {
  const newCart = await prisma.cart.create({ data: {} });

  // Note:- Needs encryption + secure settings in real production apps
  cookies().set("localCartId", newCart.id);

  return {
    ...newCart,
    size: 0,
    subTotal: 0,
    items: [],
  };
}
