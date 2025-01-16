import ProductForm from "@/components/admin/ProductForm";
import type { Category } from "@/types";
import { neon } from "@neondatabase/serverless";
async function getCategories(): Promise<Category[]> {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    SELECT id, name, slug
    FROM categories
    ORDER BY name ASC
  `;
  return rows as Category[];
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Create New Product
      </h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <ProductForm categories={categories} segments={[]} />
      </div>
    </div>
  );
}
