"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCustomer(data: {
  name: string;
  email: string;
  segment_ids: number[];
}) {
  const { name, email, segment_ids } = data;
  const rows = await sql`
    INSERT INTO customers (name, email, created_at, updated_at)
    VALUES (${name}, ${email}, NOW(), NOW())
    RETURNING id
  `;
  const customerId = rows[0].id;

  if (segment_ids.length > 0) {
    const values = segment_ids
      .map((segment_id) => `(${customerId}, ${segment_id})`)
      .join(", ");
    await sql`
      INSERT INTO customer_segment_assignments (customer_id, segment_id)
      VALUES ${values}
    `; // NOTE: check if you need equivalent for sql.unsafe instead of just `values`
  }

  revalidatePath("/admin/customers");
  return customerId;
}

export async function updateCustomer(
  id: number,
  data: { name: string; email: string; segment_ids: number[] }
) {
  const { name, email, segment_ids } = data;
  await sql`
    UPDATE customers
    SET name = ${name}, email = ${email}, updated_at = NOW()
    WHERE id = ${id}
  `;

  // Remove existing segment assignments
  await sql`
    DELETE FROM customer_segment_assignments
    WHERE customer_id = ${id}
  `;

  // Add new segment assignments
  if (segment_ids.length > 0) {
    const values = segment_ids
      .map((segment_id) => `(${id}, ${segment_id})`)
      .join(", ");
    await sql`
      INSERT INTO customer_segment_assignments (customer_id, segment_id)
      VALUES ${values}
    `; // NOTE: check if you need equivalent for sql.unsafe instead of just `values`
  }

  revalidatePath("/admin/customers");
}

export async function getCustomers() {
  const rows = await sql`
    SELECT 
      c.id, 
      c.name, 
      c.email, 
      c.created_at,
      STRING_AGG(cs.name, ', ') as segment_names,
      ARRAY_AGG(cs.id) as segment_ids
    FROM customers c
    LEFT JOIN customer_segment_assignments csa ON c.id = csa.customer_id
    LEFT JOIN customer_segments cs ON csa.segment_id = cs.id
    GROUP BY c.id, c.name, c.email, c.created_at
    ORDER BY c.name ASC
  `;
  return rows;
}

export async function getCustomerById(id: number) {
  const rows = await sql`
    SELECT 
      c.id, 
      c.name, 
      c.email, 
      ARRAY_AGG(cs.id) as segment_ids
    FROM customers c
    LEFT JOIN customer_segment_assignments csa ON c.id = csa.customer_id
    LEFT JOIN customer_segments cs ON csa.segment_id = cs.id
    WHERE c.id = ${id}
    GROUP BY c.id, c.name, c.email
  `;
  return rows[0];
}
