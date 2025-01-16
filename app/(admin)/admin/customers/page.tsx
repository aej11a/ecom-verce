import { sql } from "@/lib/db";
import Link from "next/link";
import { CustomerList } from "@/components/admin/CustomerList";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types";
import { getCustomers } from "@/app/actions/customer";

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
