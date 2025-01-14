import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";

async function getProductBySku(sku: string) {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    SELECT *
    FROM products
    WHERE sku = ${sku}
  `;
  return rows[0] || null;
}

export default async function ProductPage({
  params,
}: {
  params: { sku: string };
}) {
  const product = await getProductBySku((await params).sku);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <ProductDetails product={product} />
    </div>
  );
}
