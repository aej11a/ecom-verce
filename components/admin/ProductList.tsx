import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ProductListItem } from "@/types";

export function ProductList({ products }: { products: ProductListItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Image</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Tagline</th>
            <th className="py-2 px-4 text-left">SKU</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Last Updated</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="py-2 px-4">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="object-cover"
                />
              </td>
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">{product.tagline}</td>
              <td className="py-2 px-4">{product.sku}</td>
              <td className="py-2 px-4">${product.price}</td>
              <td className="py-2 px-4">{formatDate(product.updated_at)}</td>
              <td className="py-2 px-4">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
