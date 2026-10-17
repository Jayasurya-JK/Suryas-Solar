---
name: ship-site
description: Pre-flight check, commit, push and verify a deploy of suryassolar.com (GitHub main -> Vercel auto-deploy). Use for "deploy", "publish", "push live", "ship it", "make it live", "is my change live", or after finishing any edit to the site.
---

# Ship the site

Production = whatever is on `main` in GitHub `Jayasurya-JK/Suryas-Solar`. Vercel builds it automatically (Hobby tier). There is no separate deploy command. The FTP workflow in `.github/workflows/` is dead - ignore it.

## 1. Pre-flight (from `Web/`)
1. `git status` + `git diff --stat` - show the owner exactly what will go live. Make sure no secrets, `.env*`, `.venv/`, `out/`, `.next/` or the Search Console export folder are staged.
2. If blog posts changed: `node .claude/skills/new-blog-post/scripts/check_posts.js`.
3. If contact details / prices changed: `node .claude/skills/suryas-business-facts/scripts/nap_check.js`.
4. `npm run lint` then `npm run build` (use `npm.cmd` on PowerShell). Build must pass - Vercel runs the same command and a failed build means the site silently stays on the old version.
5. `npm run build` rewrites `public/sitemap.xml` lastmod dates - that diff is expected, commit it.

## 2. Commit + push
- Stage specific paths (not `git add -A` from the repo root, which would pick up `../Google_performance_report`).
- Message style: one short imperative line, e.g. `Add blog post on solar for 2BHK homes in Cuddalore`.
- Pushing to `main` deploys to production immediately. Always confirm with the owner before `git push`.

## 3. Verify it's live (2-3 minutes after push)
- With the Vercel MCP/plugin connected: list the latest deployment for the project and check it is `READY`; if `ERROR`, read the build logs and fix.
- Otherwise: `curl -sI https://www.suryassolar.com/<changed-path>` -> expect `200`, and grep the page for the new title/text.
- New pages/posts: tell the owner to use Search Console -> URL Inspection -> Request indexing for the new URL(s).

## Rollback
In Vercel dashboard -> Deployments -> previous READY deployment -> "Promote to Production" (instant), then fix forward with `git revert`.
