import { sql } from "@/lib/db";
import Link from "next/link";
import { CategoryList } from "@/components/admin/CategoryList";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";

async function getCategories() {
  const rows = await sql`
    SELECT id, name, slug, updated_at
    FROM categories
    ORDER BY name ASC
  `;
  return rows as Category[];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/admin/categories/new">
          <Button>Create New Category</Button>
        </Link>
      </div>
      <CategoryList categories={categories} />
    </div>
  );
}
