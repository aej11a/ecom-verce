import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { getProduct } from "@/app/actions/product";
// import { getSignedInUser } from "@/app/actions/auth";

export const experimental_ppr = true;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const [productBasic] = await sql`
    SELECT id
    FROM products
    WHERE sku = ${(await params).sku}
  `;

  if (!productBasic) {
    notFound();
  }

  // const user = await getSignedInUser();
  // const customerSegments = user ? user.segment_ids : [];
  const product = await getProduct(productBasic.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <ProductDetails product={product} />
    </div>
  );
}
export async function generateStaticParams() {
  const rows = await sql`
    SELECT sku
    FROM products
  `;
  return rows.map((row) => ({ params: { sku: row.sku } }));
}
