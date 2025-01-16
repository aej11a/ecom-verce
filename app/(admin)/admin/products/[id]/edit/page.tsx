import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import type { Category, CustomerSegment, Product } from "@/types";

async function getProduct(id: string): Promise<Product> {
  const rows = await sql`
    SELECT id, name, tagline, description, sku, price, image_url, category_id
    FROM products
    WHERE id = ${id}
  `;
  return (rows[0] as Product) || null;
}

async function getCategories(): Promise<Category[]> {
  const rows = await sql`
      SELECT id, name
      FROM categories
      ORDER BY name ASC
    `;
  return rows as Category[];
}

async function getCustomerSegments() {
  const rows = await sql`
    SELECT id, name
    FROM customer_segments
    ORDER BY name ASC
  `;
  return rows as CustomerSegment[];
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories, segments] = await Promise.all([
    getProduct((await params).id),
    getCategories(),
    getCustomerSegments(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Product</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <ProductForm
          product={product}
          categories={categories}
          segments={segments}
        />
      </div>
    </div>
  );
}
