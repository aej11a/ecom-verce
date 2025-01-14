import { sql } from "@/lib/db";
import Link from "next/link";
import { CustomerList } from "@/components/admin/CustomerList";
import { Button } from "@/components/ui/button";

async function getCustomers() {
  const rows = await sql`
    SELECT c.id, c.name, c.email, c.created_at, cs.name as segment_name
    FROM customers c
    LEFT JOIN customer_segments cs ON c.segment_id = cs.id
    ORDER BY c.name ASC
  `;
  return rows;
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link href="/admin/customers/new">
          <Button>Add New Customer</Button>
        </Link>
      </div>
      <CustomerList customers={customers} />
    </div>
  );
}
