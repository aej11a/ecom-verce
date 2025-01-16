import { Suspense } from "react";
import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import { ProductGrid } from "@/components/ProductGrid";

type FilterParams = {
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
};

async function getCategory(slug: string) {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    SELECT id, name, slug
    FROM categories
    WHERE slug = ${slug}
  `;
  return rows[0] || null;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<FilterParams>;
}) {
  const category = await getCategory((await params).slug);
  
  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar />
        <div className="flex-1">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGrid categoryId={category.id} filters={(await searchParams)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
