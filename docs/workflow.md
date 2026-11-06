# Development and release

## Normal change

1. Branch from `main`: `git switch -c feature/short-description`.
2. Keep accommodation facts in `server/catalog.mjs`, interface work in `components/site/`, and API handlers in `app/api/`.
3. Run `npm test`, `npm run typecheck`, `npm run build` and `npm run build:demo`.
4. Open a pull request with the visible behavior change and validation. Review desktop and phone layouts, keyboard behavior, booking links and factual claims.
5. Merge only after the **Tests, types and builds** job passes. Merging `main` publishes the GitHub Pages owner demo through a separate deployment job.
6. The Actions run retains the demo and Worker bundle for 14 days, named with the source commit. The Pages deployment records which commit is live.

## Two deployment targets

| Target                  | Behavior                                                                             | Release path                                                      |
| ----------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| GitHub Pages owner demo | Public homepage, filters over a bundled content snapshot, outbound reservation links | Automatic after a successful main-branch build                    |
| Server deployment       | Same React homepage plus read-only `/api/stays` and `/api/health`                    | Versioned Worker build; manually published to the private preview |

The demo and server share one component and one data module. Static hosting does not execute backend code: the Pages demo filters its bundled snapshot locally. The server version calls its API. Neither version reports live inventory or accepts payment.

## CI behavior

Pull requests and pushes to `main` install the lockfile with `npm ci`, run API tests, check TypeScript, build the Worker and browser app, and produce the demo. Deployment depends on the checks job. Actions are pinned to commit SHAs; ordinary checks only receive read access. The Pages job receives the permissions needed to publish. The project has no application secrets.

`npm run dev` starts local development. `npm run build` uses the checked-in framework wrapper. Managed preview tooling is optional; GitHub Actions runs with the portable default.

## Rollback

Revert the offending merge through a new PR. After checks pass, merge it; Pages redeploys that known source state. For the server preview, redeploy its last known-good saved version. Do not reset or force-push shared `main` to roll back a release.

## Before replacing the real business website

Owner approval, corrected stay capacities, current policies, photo-use approval, accessibility review, analytics/privacy choices, domain ownership and booking integration are separate launch work. The concept does not alter the business's current website or reservation system.
