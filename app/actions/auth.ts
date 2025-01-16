"use server";

import { sql } from "@/lib/db";
import { cookies as cookiesPromise } from "next/headers";

export async function signIn(email: string) {
  try {
    const rows = await sql`
      SELECT id, email
      FROM customers
      WHERE email = ${email}
    `;

    if (rows.length === 0) {
      return { success: false, error: "No account found with this email." };
    }

    const user = rows[0];

    const cookies = await cookiesPromise();
    // Set a cookie with the user's ID
    cookies.set("userId", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error: "An error occurred during sign in." };
  }
}

export async function signOut() {
  const cookies = await cookiesPromise();
  cookies.delete("userId");
  return { success: true };
}

export async function getSignedInUser() {
  const cookies = await cookiesPromise();
  const userId = cookies.get("userId")?.value;

  if (!userId) {
    return null;
  }

  try {
    const rows = await sql`
      SELECT c.id, c.email, ARRAY_AGG(cs.id) as segment_ids
      FROM customers c
      LEFT JOIN customer_segment_assignments csa ON c.id = csa.customer_id
      LEFT JOIN customer_segments cs ON csa.segment_id = cs.id
      WHERE c.id = ${parseInt(userId)}
      GROUP BY c.id, c.email
    `;

    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching signed-in user:", error);
    return null;
  }
}
