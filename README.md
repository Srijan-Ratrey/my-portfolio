# my-portfolio

Personal site — projects and writing. Built with [Astro](https://astro.build), deployed as a
fully static site on Cloudflare Pages.

No SSR adapter: a projects page plus a blog is static, so there is no `@astrojs/cloudflare` and
no `output: 'server'` here.

## Develop

Requires Node 22 (matches `NODE_VERSION` on Cloudflare).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
npm run preview    # serve dist/ locally
```

## Editing content

**Everything editable lives in `src/content/`.** You never need to open a `.astro`
file to change wording, add a project, or update your experience.

Two ways to edit:

### 1. The visual editor at /admin

Go to `https://srijan-ratrey.sr5.workers.dev/admin`, log in with GitHub, and edit
with forms. Saving commits to `main`, which redeploys — live in about a minute.

**One-time setup, required before /admin works:**

1. Deploy the [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
   Worker (it has a deploy button). Keep the default name `sveltia-cms-auth` so its
   URL matches `base_url` in `public/admin/config.yml`.
2. Create a GitHub OAuth app: GitHub → Settings → Developer settings → OAuth Apps →
   New. Set **Authorization callback URL** to
   `https://sveltia-cms-auth.sr5.workers.dev/callback`.
3. On that Worker, set these variables — encrypt the secret:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `ALLOWED_DOMAINS` = `srijan-ratrey.sr5.workers.dev`
     Set this. Without it, anyone who finds the Worker can use it as their own
     OAuth relay.

### 2. Editing the files directly

On github.com or locally — either way a push to `main` redeploys.

```
src/content/
├── projects/*.md      one file per card on /projects; `order` sorts them
├── experience/*.md    one file per role on /about
├── blog/*.md          posts
├── pages/home.md      lede + metric row in frontmatter, prose in the body
├── pages/about.md     education, skills, certificates + the narrative body
└── settings/site.md   site title, description, GitHub, LinkedIn, email
```

Add a project by adding a file; delete one by deleting the file.

**If you get it wrong, the build fails and the site keeps serving the old version.**
`src/content.config.ts` validates every field, so a typo produces a named error
against the exact file and field rather than a broken page. Check the Cloudflare
build log if a save doesn't appear.

Field definitions live in two places — `src/content.config.ts` (validation) and
`public/admin/config.yml` (the editor form). Adding a field means editing both.

Images: upload via /admin, or drop them in `public/uploads/` and reference them as
`/uploads/name.png`. Post images in markdown need that absolute path, not a
relative one.

## Structure

```
src/
├── components/          BaseHead, Header, Footer, FormattedDate, HeaderLink
├── content/             ALL editable content — see above
├── content.config.ts    schemas for every collection
├── layouts/BlogPost.astro
├── lib/site.ts          getSite() — site settings from content/settings/site.md
├── pages/               routes; markup only, no content
└── styles/global.css    the whole design system
public/
├── admin/               the CMS (index.html + config.yml)
├── uploads/             images
└── jigsaw/              result charts for the Jigsaw post
```

## Deploy

Cloudflare Pages, connected to this repo:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| `NODE_VERSION` | `22` |

Pushes to `main` deploy to production; pushes to any other branch get a preview URL.

`site` in `astro.config.mjs` must match the deployed origin — the RSS feed and sitemap build
absolute URLs from it, so a stale value there produces a green build with a broken feed.
