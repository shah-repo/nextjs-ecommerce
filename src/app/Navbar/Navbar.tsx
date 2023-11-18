import Image from "next/image";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import logo from "@/app/favicon.ico";
import { redirect } from "next/navigation";
import ShoppingCartButton from "./ShoppingCartButton";
import { getCart } from "@/lib/db/cart";
import UserProfileMenuButton from "./UserProfileMenuButton";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../api/auth/[...nextauth]/route";

async function searchProducts(formData: FormData) {
  "use server";

  const searchQuery = formData.get("searchField")?.toString();

  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
}

async function Navbar() {
  const cart = await getCart();
  const session = await getServerSession(nextAuthOptions);

  return (
    <div className="bg-base-100">
      <div className="navbar m-auto max-w-7xl flex-col sm:flex-row">
        <div className="flex-1">
          <Link href={"/"} className="btn btn-ghost text-xl normal-case">
            <Image src={logo} width={30} height={30} alt={"Flowmazon logo"} />
            Flomazon
          </Link>
        </div>
        <div className="flex-none">
          <form action={searchProducts}>
            <div className="form-control">
              <input
                type="text"
                name="searchField"
                placeholder="Search"
                className="min-w-[100px]: input input-bordered w-full"
              />
            </div>
          </form>
          <ShoppingCartButton {...{ cart }} />
          <UserProfileMenuButton session={session} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
