import prisma from "./prisma";
import { cookies } from "next/dist/client/components/headers";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export interface ShoppingCart extends CartWithProducts {
  size: number;
  subTotal: number;
}

export async function getCart(): Promise<ShoppingCart | null> {
  const session = await getServerSession(nextAuthOptions);
  let cart: CartWithProducts | null = null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    });
  } else {
    const localCartId = cookies().get("localCartId")?.value;
    cart = localCartId
      ? await prisma.cart.findUnique({
          where: { id: localCartId },
          include: { items: { include: { product: true } } },
        })
      : null;
  }

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
  const session = await getServerSession(nextAuthOptions);

  let newCart: Cart;

  if (session) {
    // session.user.id will show error like 'Property 'id' does not exist on type user'
    // By default 'id' not content in user object, next-auth doesn't return it by default.
    // we have to add 'id' ourself inside the route handler file,
    // in NextAuthOptions config object by adding callbacks field.
    newCart = await prisma.cart.create({ data: { userId: session?.user.id } });
  } else {
    newCart = await prisma.cart.create({ data: {} });

    // Note:- Needs encryption + secure settings in real production apps
    cookies().set("localCartId", newCart.id);
  }

  return {
    ...newCart,
    size: 0,
    subTotal: 0,
    items: [],
  };
}

// We want to call this method just right after the login, so before the page open the merging already happened
export async function mergeAnonymousCartWithUserCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;

  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: true },
      })
    : null;

  if (!localCart) return;

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  // For DB roll back functionality we can use prisma $transaction function,
  // the function passes prismaClient as argument, so that we can use it for DB transaction inside the same function
  // Every operation we call on this prisma client will be part of transaction.
  // A DB transaction is a process where multiple operations can run but if one of them fails, the whole transaction will be rolled back,
  // and none of the cahnge will be applied, the below example is to execute transaction with prisma
  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(userCart.items, localCart.items);
      // Now delete user cart items
      await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
      // Now create new merged cart items
      await tx.cartItem.createMany({
        data: mergedCartItems.map((cartItem) => ({
          cartId: userCart.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
        })),
      });
    } else {
      await tx.cart.create({
        data: {
          userId,
          // it's a relation query in prisma, it will automatically be connected by adding the cart 'id' to these items.
          items: {
            createMany: {
              data: localCart.items.map((cartItem) => ({
                productId: cartItem.productId,
                quantity: cartItem.quantity,
              })),
            },
          },
        },
      });
    }
    // Now delete the local cart
    await tx.cart.delete({ where: { id: localCart.id } });
    cookies().set("localCartId", "");
  });
}

function mergeCartItems(...cartItems: CartItem[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}
