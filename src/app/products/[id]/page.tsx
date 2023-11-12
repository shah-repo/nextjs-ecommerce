import PriceTag from "@/components/PriceTag";
import prisma from "@/lib/db/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

interface ProductPageProps {
  params: {
    id: string;
  };
}
export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return notFound();
  }
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <Image
          src={product.url}
          className="w-full max-w-sm rounded-lg shadow-2xl"
          width={400}
          height={600}
          alt={product.name}
          priority
        />
        <div>
          <h1 className="text-5xl font-bold">{product.name}!</h1>
          {isNew && <span className="badge badge-secondary mt-4">New</span>}
          <p className="py-6">{product.description}</p>
          <PriceTag price={product.price} />
        </div>
      </div>
    </div>
  );
}
