import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Customer } from "@/types";

export function CustomerList({ customers }: { customers: Customer[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Segments</th>
            <th className="py-2 px-4 text-left">Created At</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b">
              <td className="py-2 px-4">{customer.name}</td>
              <td className="py-2 px-4">{customer.email}</td>
              <td className="py-2 px-4">
                {customer.segment_names || "Not assigned"}
              </td>
              <td className="py-2 px-4">{formatDate(customer.created_at)}</td>
              <td className="py-2 px-4">
                <Link
                  href={`/admin/customers/${customer.id}/edit`}
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
