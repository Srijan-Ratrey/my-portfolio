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

## Structure

```
src/
├── components/          BaseHead, Header, Footer, FormattedDate, HeaderLink
├── content/blog/        one .md per post (title, description, pubDate)
├── content.config.ts    blog collection schema
├── layouts/BlogPost.astro
├── pages/
│   ├── index.astro      home
│   ├── projects.astro   project list — edit the `projects` array
│   ├── about.astro
│   ├── blog/            index + [...slug]
│   └── rss.xml.js
├── consts.ts            SITE_TITLE, SITE_DESCRIPTION, GITHUB_URL
└── styles/global.css
public/jigsaw/           result charts for the Jigsaw post
```

## Adding a post

Drop a `.md` file in `src/content/blog/`. Frontmatter must satisfy the schema in
`src/content.config.ts`:

```yaml
---
title: 'Post title'
description: 'One line, used for the meta description and RSS.'
pubDate: 'Aug 03 2026'
heroImage: '../../assets/optional.png'   # optional
---
```

Post images referenced from markdown go in `public/` and are linked with an absolute path
(`/jigsaw/chart.png`), not a relative one.

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
