"use server";
import { createCart, getCart } from "@/lib/db/cart";
import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function increementProductQuantity(productId: string) {
  // Note:- we call createCart mthd here, because we don't want to create cart immedeately,
  // until to modify the cart by adding a product,
  // we don't want to bloat DB with empty anonymous carts
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.items.find((item) => item.productId === productId);

  if (articleInCart) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          update: {
            where: { id: articleInCart.id },
            data: { quantity: { increment: 1 } },
          },
        },
      },
    });
    // await prisma.cartItem.update({
    //   where: { id: articleInCart.id },
    //   data: { quantity: { increment: 1 } },
    // });
  } else {
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          create: {
            productId,
            quantity: 1,
          },
        },
      },
    });
    // await prisma.cartItem.create({
    //   data: { cartId: cart.id, productId, quantity: 1 },
    // });
  }

  // Note:- This line will take care of to refresh screen with the latest data
  revalidatePath("/products/[id]");
}
