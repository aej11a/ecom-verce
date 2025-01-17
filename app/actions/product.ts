"use server";

import { sql } from "@/lib/db";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Product } from "@/types";

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
  let query = `
    SELECT id, name, tagline, sku, price, image_url
    FROM products
    WHERE category_id = ${categoryId}
  `;

  if (filters.minPrice) {
    query = `${query} AND price >= ${parseFloat(filters.minPrice)}`;
  }

  if (filters.maxPrice) {
    query = `${query} AND price <= ${parseFloat(filters.maxPrice)}`;
  }

  if (await filters.sortBy) {
    switch (filters.sortBy) {
      case "price_asc":
        query = `${query} ORDER BY price ASC`;
        break;
      case "price_desc":
        query = `${query} ORDER BY price DESC`;
        break;
      case "name_asc":
        query = `${query} ORDER BY name ASC`;
        break;
      case "name_desc":
        query = `${query} ORDER BY name DESC`;
        break;
      default:
        query = `${query} ORDER BY name ASC`;
    }
  } else {
    query = `${query} ORDER BY name ASC`;
  }

  const rows = await sql(query.trim());
  return rows;
}

export async function addPersonalizedDescription(
  productId: number,
  segmentIds: number[],
  description: string
) {
  const segmentKey = segmentIds.sort().join("-");

  await sql`
    UPDATE products
    SET personalized_descriptions = personalized_descriptions || ${JSON.stringify(
      { [segmentKey]: description }
    )}::jsonb
    WHERE id = ${productId}
  `;

  // Insert or ignore the segment combination
  await sql`
    INSERT INTO segment_combinations (segment_ids)
    VALUES (${segmentIds})
    ON CONFLICT (segment_ids) DO NOTHING
  `;

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/product/${productId}`);
}

export async function generatePersonalizedDescription(
  productId: number,
  segmentIds: number[]
) {
  const [product] = await sql`
    SELECT name, description
    FROM products
    WHERE id = ${productId}
  `;

  const segments = await sql`
    SELECT name
    FROM customer_segments
    WHERE id = ANY(${segmentIds})
  `;

  const segmentNames = segments.map((s) => s.name).join(", ");

  const prompt = `
    Product: ${product.name}
    Original description: ${product.description}
    Target audience: ${segmentNames}

    Please rewrite the product description to appeal specifically to the target audience. 
    Focus on aspects that would be most relevant and attractive to this group. 
    Keep the tone consistent with the original description but tailor the content to highlight 
    features and benefits that would resonate with the specified audience.
    The new description should be concise, around 2-3 sentences long.
  `;

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  });

  const segmentKey = segmentIds.sort().join("-");

  await sql`
    UPDATE products
    SET personalized_descriptions = personalized_descriptions || ${JSON.stringify(
      { [segmentKey]: text }
    )}::jsonb
    WHERE id = ${productId}
  `;

  revalidatePath(`/admin/products/${productId}`);

  return text;
}

export async function getProduct(id: number) {
  const [product] = await sql`
    SELECT id, name, tagline, description, sku, price, image_url
    FROM products
    WHERE id = ${id}
  `;

  return product as Product;
}

export async function getProductsByIds(ids: number[]) {
  const rows = await sql`
    SELECT id, name, price, image_url, sku
    FROM products
    WHERE id = ANY(${ids})
  `;
  return rows as Product[];
}

export async function getProductWithPersonalizedDescription(
  productId: number,
  customerSegmentIds: number[]
) {
  const [product] = await sql`
    SELECT id, name, tagline, description, sku, price, image_url, personalized_descriptions
    FROM products
    WHERE id = ${productId}
  `;

  if (!product) return null;

  let personalizedDescription = null;
  if (customerSegmentIds.length > 0 && product.personalized_descriptions) {
    const segmentCombinations = Object.keys(product.personalized_descriptions)
      .map((key) => key.split("-").map(Number))
      .filter((combination) =>
        combination.every((id) => customerSegmentIds.includes(id))
      )
      .sort((a, b) => b.length - a.length);

    if (segmentCombinations.length > 0) {
      const bestMatch = segmentCombinations[0].sort().join("-");
      personalizedDescription = product.personalized_descriptions[bestMatch];
    }
  }

  return { ...product, personalizedDescription };
}

export async function deletePersonalizedDescription(
  productId: number,
  segmentIds: number[]
) {
  const segmentKey = segmentIds.sort().join("-");

  await sql`
    UPDATE products
    SET personalized_descriptions = personalized_descriptions - ${segmentKey}
    WHERE id = ${productId}
  `;

  revalidatePath(`/admin/products/${productId}`);
}

export async function regeneratePersonalizedDescription(
  productId: number,
  segmentIds: number[]
) {
  console.log(productId);
  const [product] = await sql`
    SELECT name, description
    FROM products
    WHERE id = ${productId}
  `;

  const segments = await sql`
    SELECT name
    FROM customer_segments
    WHERE id = ANY(${segmentIds})
  `;

  const segmentNames = segments.map((s) => s.name).join(", ");

  const prompt = `
    Product: ${product.name}
    Original description: ${product.description}
    Target audience: ${segmentNames}

    Please rewrite the product description to appeal specifically to the target audience. 
    Focus on aspects that would be most relevant and attractive to this group. 
    Keep the tone consistent with the original description but tailor the content to highlight 
    features and benefits that would resonate with the specified audience.
    The new description should be concise, around 2-3 sentences long.
  `;

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  });

  const segmentKey = segmentIds.sort().join("-");

  await sql`
    UPDATE products
    SET personalized_descriptions = personalized_descriptions || ${JSON.stringify(
      { [segmentKey]: text }
    )}::jsonb
    WHERE id = ${productId}
  `;

  revalidatePath(`/admin/products/${productId}`);
  return text;
}

export async function getPersonalizedDescriptions(productId: number) {
  const [product] = await sql`
    SELECT personalized_descriptions
    FROM products
    WHERE id = ${productId}
  `;

  if (!product || !product.personalized_descriptions) {
    return [];
  }

  const descriptions = Object.entries(product.personalized_descriptions).map(
    ([key, value]) => ({
      segmentIds: key.split("-").map(Number),
      description: value as string,
    })
  );

  const segments = await sql`
    SELECT id, name
    FROM customer_segments
    WHERE id = ANY(${descriptions.flatMap((d) => d.segmentIds)})
  `;

  const segmentMap = new Map(segments.map((s) => [s.id, s.name]));

  return descriptions.map((d) => ({
    ...d,
    segmentNames: d.segmentIds
      .map((id) => segmentMap.get(id) || "Unknown Segment")
      .join(", "),
  }));
}
