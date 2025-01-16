"use server";

import { sql } from "@/lib/db";
import { CustomerSegment } from "@/types";
import { revalidatePath } from "next/cache";

export async function createCustomerSegment(data: {
  name: string;
  slug: string;
}) {
  const { name, slug } = data;
  const rows = await sql`
    INSERT INTO customer_segments (name, slug, created_at, updated_at)
    VALUES (${name}, ${slug}, NOW(), NOW())
    RETURNING id
  `;
  revalidatePath("/admin/customer-segments");
  return rows[0].id;
}

export async function updateCustomerSegment(
  id: number,
  data: { name: string; slug: string }
) {
  const { name, slug } = data;
  await sql`
    UPDATE customer_segments
    SET name = ${name}, slug = ${slug}, updated_at = NOW()
    WHERE id = ${id}
  `;
  revalidatePath("/admin/customer-segments");
}

export async function getCustomerSegments() {
  const rows = await sql`
    SELECT id, name, slug
    FROM customer_segments
    ORDER BY name ASC
  `;
  return rows as CustomerSegment[];
}
