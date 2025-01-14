"use server";

import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = parseInt(formData.get("category_id") as string);
  const image = formData.get("image") as File;

  let imageUrl = "";
  if (image) {
    const { url } = await put(image.name, image, { access: "public" });
    imageUrl = url;
  }

  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    INSERT INTO products (name, tagline, description, sku, price, image_url, category_id, updated_at, updated_by)
    VALUES (${name}, ${tagline}, ${description}, ${sku}, ${price}, ${imageUrl}, ${categoryId}, NOW(), 'system')
    RETURNING id
  `;

  revalidatePath("/admin/products");
  return rows[0].id;
}

export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = parseInt(formData.get("category_id") as string);
  const image = formData.get("image") as File | null;

  let imageUrl = formData.get("image_url") as string;
  if (image) {
    const { url } = await put(image.name, image, { access: "public" });
    imageUrl = url;
  }

  const sql = neon(process.env.DATABASE_URL);
  await sql`
    UPDATE products
    SET name = ${name}, tagline = ${tagline}, description = ${description}, 
        sku = ${sku}, price = ${price}, image_url = ${imageUrl}, 
        category_id = ${categoryId}, updated_at = NOW(), updated_by = 'system'
    WHERE id = ${id}
  `;

  revalidatePath("/admin/products");
}

export async function getFilteredProducts(
  categoryId: number,
  filters: {
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  }
) {
  const sql = neon(process.env.DATABASE_URL);

  // Base query and parameters
  let query = `
    SELECT id, name, tagline, sku, price, image_url
    FROM products
    WHERE category_id = $1
  `;
  const params: (string | number)[] = [categoryId];

  // Apply filters dynamically
  if (filters.minPrice) {
    query += ` AND price >= $${params.length + 1}`;
    params.push(parseFloat(filters.minPrice));
  }

  if (filters.maxPrice) {
    query += ` AND price <= $${params.length + 1}`;
    params.push(parseFloat(filters.maxPrice));
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price_asc":
        query += ` ORDER BY price ASC`;
        break;
      case "price_desc":
        query += ` ORDER BY price DESC`;
        break;
      case "name_asc":
        query += ` ORDER BY name ASC`;
        break;
      case "name_desc":
        query += ` ORDER BY name DESC`;
        break;
      default:
        query += ` ORDER BY name ASC`;
    }
  } else {
    query += ` ORDER BY name ASC`;
  }

  // Log the final query for debugging
  console.log(query, params);

  // Execute the query with parameters
  const rows = await sql(query, params)
  return rows;
}
