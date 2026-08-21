import { getSearchSuggetion } from "@/DataRoutes/Routes/getSearchSuggetions.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return new Response(JSON.stringify({ suggestions: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  const result = await getSearchSuggetion(q);
  const suggestions = result.data?.suggestions || [];

  return new Response(JSON.stringify({ suggestions }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
