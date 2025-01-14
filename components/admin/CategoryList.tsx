import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Category } from "@/types";

export function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Slug</th>
            <th className="py-2 px-4 text-left">Last Updated</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b">
              <td className="py-2 px-4">{category.name}</td>
              <td className="py-2 px-4">{category.slug}</td>
              <td className="py-2 px-4">{formatDate(category.updated_at)}</td>
              <td className="py-2 px-4">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
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
