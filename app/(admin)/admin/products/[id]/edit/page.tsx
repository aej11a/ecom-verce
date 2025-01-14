import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import ProductForm, { Category, Product } from "@/components/admin/ProductForm";

async function getProduct(id: string): Promise<Product> {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    SELECT id, name, tagline, description, sku, price, image_url, category_id
    FROM products
    WHERE id = ${id}
  `;
  return (rows[0] as Product) || null;
}

async function getCategories(): Promise<Category[]> {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
      SELECT id, name, slug
      FROM categories
      ORDER BY name ASC
    `;
  return rows as Category[];
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Product</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  )
}
