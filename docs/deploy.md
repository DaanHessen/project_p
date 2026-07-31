# Deploying to Vercel

The site is a static Vite build. `vercel.json` sets the framework, the SPA
rewrite that keeps `/cv` alive on a hard refresh, security headers, and
redirects from the old `/resume` URLs.

## 1. Push the branch

```bash
git push -u origin redesign
```

Merge to `main` when you're happy with it — Vercel deploys `main` as production
and gives every other branch a preview URL.

## 2. Create the project

1. <https://vercel.com/new> → import `DaanHessen/project_p`.
2. Framework preset: **Vite** (it should autodetect).
3. Build command `npm run build`, output directory `dist`. Both already come
   from `vercel.json`, so leave the defaults alone.
4. Deploy. You get a `*.vercel.app` URL. Check `/` and `/cv` work, and that
   refreshing on `/cv` does not 404.

## 3. Add the domain

In the project: **Settings → Domains → Add**, enter `daanhessen.nl`. Accept the
prompt to also add `www.daanhessen.nl`.

Vercel then shows you the exact records to create. **Use the values on that
screen, not values from any guide** — the apex IP differs per project (some get
`76.76.21.21`, newer ones `216.198.79.1`) and the `www` CNAME target is unique
to your project (something like `d1d4fc829fe7bc7c.vercel-dns-017.com`, not the
old generic `cname.vercel-dns.com`).

## 4. Fix DNS at mijn.host

Go to **daanhessen.nl → DNS instellingen**. Your current records point at
mijn.host's parking server, so the web ones must go.

**Delete these four:**

| Naam | Type | Content |
| --- | --- | --- |
| *(empty)* | A | `217.180.14.65` |
| *(empty)* | AAAA | `2a11:4881:1:9f8::1` |
| `*` | A | `217.180.14.65` |
| `*` | AAAA | `2a11:4881:1:9f8::1` |

The two wildcards (`*`) matter: leaving them means `www` resolves to mijn.host
and quietly overrides the CNAME you're about to add.

**Keep these — they are your email**, and deleting them breaks mail delivery:

| Naam | Type | Content |
| --- | --- | --- |
| *(empty)* | MX | `mx1.mijn.host` (prio 10) |
| *(empty)* | MX | `mx2.mijn.host` (prio 20) |
| *(empty)* | TXT | `v=spf1 a mx include:spf.mijn.host ~all` |
| `_dmarc` | TXT | `v=DMARC1; p=reject; sp=reject;` |

**Add the two Vercel records:**

| Naam | Type | Content |
| --- | --- | --- |
| *(empty)* | A | the IP from your Vercel domain card |
| `www` | CNAME | the target from your Vercel domain card |

Click **Opslaan**. TTL is 15 min, so allow up to an hour; Vercel issues the
HTTPS certificate automatically once it sees the records.

> The SPF record contains `a`, which authorises whatever IP the apex A record
> points at to send mail. After this change that's Vercel rather than your mail
> host. The `mx` and `include:` parts still cover real delivery, so mail keeps
> working — but tightening it to `v=spf1 mx include:spf.mijn.host ~all` is
> cleaner. Optional, and unrelated to the site.

## 5. Verify

```bash
dig +short daanhessen.nl
dig +short www.daanhessen.nl
curl -sI https://daanhessen.nl | head -1
curl -sI https://daanhessen.nl/cv | head -1
curl -sI https://daanhessen.nl/resume | head -1   # expect 308 to /cv
```

Then in a browser: hard-refresh `https://daanhessen.nl/cv`. If that renders
rather than 404s, the SPA rewrite is working.

## Ongoing

Every push to `main` redeploys. Pull requests get preview URLs.

The "More on GitHub" section on the CV is fetched live in the browser, so it
does **not** need a deploy to update — see `src/data/github.ts`.

## Local production preview

`server.mjs` still exists for serving the built output locally with the same
SPA fallback:

```bash
npm run build
npm run serve   # http://localhost:4173
```

It is excluded from the Vercel upload by `.vercelignore`.
