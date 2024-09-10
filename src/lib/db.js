import { sql } from "@vercel/postgres";

export default async function executeQuery({ query, values }) {
  try {
    const results = await sql`
      ${query}
      ${sql(...values)}
    `;
  } catch (error) {
    return { error };
  }
}
