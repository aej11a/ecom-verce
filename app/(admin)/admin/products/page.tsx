import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import { ProductList } from "@/components/admin/ProductList";
import { Button } from "@/components/ui/button";

async function getProducts() {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    SELECT id, name, tagline, sku, price, image_url, updated_at
    FROM products
    ORDER BY updated_at DESC
  `;
  return rows;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>Create New Product</Button>
        </Link>
      </div>
      <ProductList products={products} />
    </div>
  );
}
