import { getCart } from "@/lib/db/cart";
import { formatCurrency } from "@/lib/format";
import { Metadata } from "next";
import React from "react";
import { setProductQuantity } from "./actions";
import CartItem from "./CartItem";

export const metadata: Metadata = {
  title: "Your Cart - Flowmazon",
};

const Cart = async () => {
  const cart = await getCart();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((item) => {
        return (
          <CartItem
            cartItem={item}
            key={item.id}
            setProductQuantity={setProductQuantity}
          />
        );
      })}
      {!cart?.items.length && <span>Your cart is empty</span>}
      <div className="flex flex-col sm:items-center">
        <div className="mb-3 gap-4 font-bold">
          SubTotal: {formatCurrency(cart?.subTotal || 0)}
        </div>
        <button className="btn btn-primary sm:w-52">Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
