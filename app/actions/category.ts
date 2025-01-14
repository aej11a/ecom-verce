"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function createCategory(data: { name: string; slug: string }) {
  const { name, slug } = data;
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    INSERT INTO categories (name, slug, created_at, updated_at)
    VALUES (${name}, ${slug}, NOW(), NOW())
    RETURNING id
  `;
  revalidatePath("/admin/categories");
  return rows[0].id;
}

export async function updateCategory(
  id: number,
  data: { name: string; slug: string }
) {
  const { name, slug } = data;
  const sql = neon(process.env.DATABASE_URL);
  await sql`
    UPDATE categories
    SET name = ${name}, slug = ${slug}, updated_at = NOW()
    WHERE id = ${id}
  `;
  revalidatePath("/admin/categories");
}

export async function getCategories() {
    const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    SELECT id, name, slug
    FROM categories
    ORDER BY name ASC
  `;
  return rows;
}
