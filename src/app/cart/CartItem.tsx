"use client";
import { CartItemWithProduct } from "@/lib/db/cart";
import { formatCurrency } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import React, { useTransition } from "react";

interface CartItemProps {
  cartItem: CartItemWithProduct;
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

const quantityOptions: JSX.Element[] = [];

Array.from({ length: 100 }, (v, i) => {
  quantityOptions.push(<option value={i + 1}>{i + 1}</option>);
});

const CartItem: React.FC<CartItemProps> = ({
  cartItem,
  setProductQuantity,
}) => {
  const { quantity, product } = cartItem;
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div className="card card-side bg-base-100 shadow-xl">
        <figure>
          <Image
            src={product.url}
            alt={product.name}
            width={800}
            height={400}
            className="m-4 h-48 w-60 rounded-2xl object-cover"
          />
        </figure>
        <div className="card-body">
          <Link href={`/products/${product.id}`} className="card-title">
            {product.name}!
          </Link>
          <span className="flex flex-row gap-4 text-slate-500">
            Price: <span>{formatCurrency(product.price)} </span>
          </span>
          <div className="flex items-center gap-4 text-slate-500">
            Quantity:
            <select
              className="select select-bordered max-w-[5rem]"
              defaultValue={quantity}
              onChange={(e) => {
                startTransition(
                  async () =>
                    await setProductQuantity(
                      product.id,
                      Number(e.target.value),
                    ),
                );
              }}
            >
              <option value={0}>0 (Remove)</option>
              {...quantityOptions}
            </select>
          </div>
          <span className="flex gap-4 text-info">
            Total: <span>{formatCurrency(product.price * quantity || 0)}</span>
            {isPending && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
          </span>
        </div>
      </div>
      <div className="divider" />
    </div>
  );
};

export default CartItem;
