// Small helpers for Astro API routes.
export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
