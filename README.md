# Country Road Cabins

A homepage concept for Country Road Cabins in Hico, West Virginia. The goal is to make the place feel as good online as it looks in the photos, then give visitors a clear path to choosing a stay.

This is an independent portfolio project by Dylan Cornett. It is not the business's official website or a completed client engagement.

## The page

Real property photography, a responsive editorial layout, stay filters, accommodation details, a photo gallery, local experiences and FAQs. Booking buttons open the business's existing reservation system. There are no invented prices or availability claims.

## Run locally

Node.js 24 and npm:

```sh
npm ci
npm run dev
```

```sh
npm test
npm run typecheck
npm run build
npm run build:demo
```

## Project structure

| Path                           | Purpose                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| `components/site/Homepage.tsx` | Shared, responsive React interface                         |
| `app/globals.css`              | Custom visual design and responsive rules                  |
| `server/catalog.mjs`           | Sourced stay data and filter validation                    |
| `app/api/stays/route.ts`       | Read-only stay catalogue API                               |
| `app/api/health/route.ts`      | Small health endpoint                                      |
| `tests/`                       | API behavior and invalid-input tests                       |
| `scripts/build-demo.mjs`       | Static owner demo from the same component                  |
| `.github/workflows/ci.yml`     | Tests, type checks, builds, artifacts and Pages deployment |
| `docs/research.md`             | Research, sources and facts to confirm                     |
| `docs/workflow.md`             | Development, release and rollback steps                    |

The frontend uses React and TypeScript with custom CSS. The server build uses Vinext and Cloudflare Workers. The GitHub Pages version uses a bundled catalogue snapshot; the server deployment uses the read-only API. Neither is a live booking engine.

Feature branches go through pull requests and automated checks. Successful changes to `main` deploy the owner demo. The Worker build is retained as a review artifact and published separately. See [the workflow](docs/workflow.md) for the exact boundary.

## Photography and branding

Images came from the official business website, with URLs recorded in [the asset manifest](asset-sources.json). Photography and trademarks remain the property of their respective owners. They are excluded from the source-code license. The proposed wordmark and layout are a design study awaiting owner review.
