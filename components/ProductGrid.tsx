import { getFilteredProducts } from "@/app/actions/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type FilterParams = {
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
};

export async function ProductGrid({
  categoryId,
  filters,
}: {
  categoryId: number;
  filters: FilterParams;
}) {
  const products = await getFilteredProducts(categoryId, filters);

  if (products.length === 0) {
    return (
      <p className="text-gray-500">
        No products found matching the selected filters.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col">
          <CardContent className="p-4">
            <div className="aspect-square relative mb-4">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.tagline}</p>
            <p className="text-lg font-bold">${product.price}</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button asChild className="w-full">
              <Link href={`/product/${product.sku}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
