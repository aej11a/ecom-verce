import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import type { Category } from "@/types";

async function getCategory(id: string): Promise<Category | null> {
  const rows = await sql`
    SELECT id, name, slug
    FROM categories
    WHERE id = ${id}
  `;
  return (rows[0] as Category) || null;
}

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategory(params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Category</h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
