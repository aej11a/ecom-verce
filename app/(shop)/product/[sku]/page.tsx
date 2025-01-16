import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { getProductWithPersonalizedDescription } from "@/app/actions/product";
import { getSignedInUser } from "@/app/actions/auth";

export default async function ProductPage({
  params,
}: {
  params: { sku: string };
}) {
  const [productBasic] = await sql`
    SELECT id
    FROM products
    WHERE sku = ${(await params).sku}
  `;

  if (!productBasic) {
    notFound();
  }

  const user = await getSignedInUser();
  const customerSegments = user ? user.segment_ids : [];
  const product = await getProductWithPersonalizedDescription(
    productBasic.id,
    customerSegments
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <ProductDetails product={product} />
    </div>
  );
}
