import { getSignedInUser } from "@/app/actions/auth";
import { getProductWithPersonalizedDescription } from "@/app/actions/product";

export default async function PersonalizedDescription({
  productId,
}: {
  productId: number;
}) {
  const user = await getSignedInUser();
  const customerSegments = user ? user.segment_ids : [];
  const personalizedProduct = await getProductWithPersonalizedDescription(
    productId,
    customerSegments
  );
  if (!personalizedProduct) {
    return null;
  }
  return (
    <div className="mb-4 bg-blue-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Why you&apos;ll love it</h2>
      <p className="text-gray-700">
        {personalizedProduct.personalizedDescription}
      </p>
    </div>
  );
}
