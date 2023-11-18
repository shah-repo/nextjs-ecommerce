import React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import FormSubmitButton from "@/components/FormSubmitButton";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Add your product easily",
};

async function addProduct(formData: FormData) {
  "use server";

  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  try {
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const url = formData.get("url")?.toString();
    const price = Number(formData.get("price") || 0);
    if (!name || !description || !url || !price) {
      throw new Error("Missing required fields");
    }
    await prisma.product.create({
      data: { name, description, url, price },
    });
    redirect("/");
  } catch (error) {
    console.error("Error adding product:", error);
    // Handle the error or rethrow it if needed.
    throw error;
  }
}

const page = async () => {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add Product</h1>
      <form action={addProduct}>
        <input
          name="name"
          placeholder="Name"
          required
          className="input input-bordered mb-3 w-full"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered mb-3 w-full"
        />
        <input
          name="url"
          placeholder="Image URL"
          type={"url"}
          required
          className="input input-bordered mb-3 w-full"
        />
        <input
          name="price"
          placeholder="Price"
          type={"number"}
          required
          className="input input-bordered mb-3 w-full"
        />
        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
    </div>
  );
};

export default page;
