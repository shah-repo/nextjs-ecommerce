import PriceTag from "@/components/PriceTag";
import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const productList = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div>
      <div className="hero min-h-[24rem] justify-start bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            src={productList[0].url}
            className="w-full max-w-sm rounded-lg shadow-2xl"
            width={400}
            height={600}
            alt={productList[0].name}
            priority
          />
          <div>
            <h1 className="text-5xl font-bold">{productList[0].name}!</h1>
            <p className="py-6">{productList[0].description}</p>
            <PriceTag className="mb-4 block" price={productList[0].price} />
            <Link
              href={"/products/" + productList[0].id}
              className="btn btn-primary"
            >
              Check it out
            </Link>
          </div>
        </div>
      </div>
      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {productList.slice(1).map((product) => (
          <ProductCard {...{ product }} key={product.id} />
        ))}
      </div>
    </div>
  );
}
