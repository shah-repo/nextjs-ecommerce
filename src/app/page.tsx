import PaginationBar from "@/components/PaginationBar";
import PriceTag from "@/components/PriceTag";
import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

interface Props {
  searchParams: {
    page: string;
  };
}

export default async function Home({ searchParams: { page = "1" } }: Props) {
  const pageSize = 4;
  const totalProducts = await prisma.product.count();
  const heropage = 1;
  const totalPages = Math.ceil((totalProducts - heropage) / pageSize);
  const currentPage = parseInt(page);

  const productList = await prisma.product.findMany({
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heropage),
    take: pageSize + (currentPage === 1 ? heropage : 0),
  });

  return (
    <div className={"flex flex-col items-center"}>
      {currentPage === 1 && (
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
      )}
      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {(currentPage === 1 ? productList.slice(1) : productList).map(
          (product) => (
            <ProductCard {...{ product }} key={product.id} />
          ),
        )}
      </div>
      {totalPages > 1 && (
        <PaginationBar currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
