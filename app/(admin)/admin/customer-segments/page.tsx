import { sql } from "@/lib/db";
import Link from "next/link";
import { CustomerSegmentList } from "@/components/admin/CustomerSegmentList";
import { Button } from "@/components/ui/button";
import { CustomerSegment } from "@/types";

async function getCustomerSegments() {
  const rows = await sql`
    SELECT id, name, slug, created_at
    FROM customer_segments
    ORDER BY name ASC
  `;
  return rows as CustomerSegment[];
}

export default async function CustomerSegmentsPage() {
  const segments = await getCustomerSegments();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Segments</h1>
        <Link href="/admin/customer-segments/new">
          <Button>Create New Segment</Button>
        </Link>
      </div>
      <CustomerSegmentList segments={segments} />
    </div>
  );
}
