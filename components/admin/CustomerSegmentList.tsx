import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { CustomerSegment } from "@/types";

export function CustomerSegmentList({
  segments,
}: {
  segments: CustomerSegment[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Slug</th>
            <th className="py-2 px-4 text-left">Created At</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((segment) => (
            <tr key={segment.id} className="border-b">
              <td className="py-2 px-4">{segment.name}</td>
              <td className="py-2 px-4">{segment.slug}</td>
              <td className="py-2 px-4">{formatDate(segment.created_at)}</td>
              <td className="py-2 px-4">
                <Link
                  href={`/admin/customer-segments/${segment.id}/edit`}
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
