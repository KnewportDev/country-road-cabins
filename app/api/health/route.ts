export function GET() {
  return Response.json(
    { status: "ok", service: "country-road-cabins", version: "0.1.0" },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
