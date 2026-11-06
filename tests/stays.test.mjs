import test from "node:test";
import assert from "node:assert/strict";
import { queryStays, stays } from "../server/catalog.mjs";
import { GET as getStays } from "../app/api/stays/route.ts";
import { GET as getHealth } from "../app/api/health/route.ts";

test("default response identifies the collection as featured, not live availability", async () => {
  const response = getStays(new Request("https://example.test/api/stays"));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.availability, "not-live");
  assert.equal(body.collection, "featured");
  assert.equal(body.count, body.stays.length);
  assert.ok(body.count > 0);
  assert.equal(response.headers.get("Cache-Control"), "public, max-age=300");
});

test("category and capacity filters combine without claiming room availability", () => {
  const result = queryStays(
    new URLSearchParams("category=treehouses&guests=4"),
  );
  assert.equal(result.status, 200);
  assert.deepEqual(
    result.body.stays.map((s) => s.id),
    ["tuscany"],
  );
});

test("a larger group gets an empty featured collection instead of unsuitable stays", () => {
  const result = queryStays(new URLSearchParams("guests=8"));
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.stays, []);
});

test("unknown category is rejected and the error response is not cached", async () => {
  const response = getStays(
    new Request("https://example.test/api/stays?category=unknown"),
  );
  assert.equal(response.status, 400);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.match((await response.json()).error, /category/);
});

for (const guests of ["-1", "1.5", "1e2", "NaN", "99", " 2", "02"]) {
  test(`reject malformed guest count: ${JSON.stringify(guests)}`, () => {
    const result = queryStays(new URLSearchParams({ guests }));
    assert.equal(result.status, 400);
  });
}

test("detail links remain on the verified business domain", () => {
  for (const stay of stays) {
    const url = new URL(stay.url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "wvcabins.com");
    assert.ok(url.pathname.startsWith("/accommodation/"));
    assert.ok(stay.guests > 0 && Number.isInteger(stay.guests));
  }
});

test("health endpoint is read-only and does not expose environment details", async () => {
  const response = getHealth();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(Object.keys(await response.json()).sort(), [
    "service",
    "status",
    "version",
  ]);
});
