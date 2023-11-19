import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/db/prisma";
import React from "react";

interface Props {
  searchParams: {
    query: string;
  };
}

async function SearchPage({ searchParams: { query = "" } }: Props) {
  const productList = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { id: "desc" },
  });

  if (!productList) {
    return <div className="text-center">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {productList.map((product) => (
        <ProductCard {...{ product }} key={product.id} />
      ))}
    </div>
  );
}

export default SearchPage;
