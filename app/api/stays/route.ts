import { queryStays } from "../../../server/catalog.mjs";

export function GET(request: Request) {
  const result = queryStays(new URL(request.url).searchParams);
  return Response.json(result.body, {
    status: result.status,
    headers: {
      "Cache-Control":
        result.status === 200 ? "public, max-age=300" : "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
