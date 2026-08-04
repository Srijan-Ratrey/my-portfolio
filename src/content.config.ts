import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
  Every editable word on the site lives in src/content/. The schemas below are the
  safety net: a missing or misspelled field fails `npm run build` with a named
  error instead of quietly rendering a broken page.

  If a save from /admin produces invalid content the build fails and production
  keeps serving the previous version — that shows up as a failed Cloudflare build,
  not as an error on the live site.

  Field definitions are duplicated in public/admin/config.yml, which is how the
  CMS knows what form to draw. Adding a field means editing both.
*/

const linkSchema = z.object({
	label: z.string(),
	href: z.string(),
});

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		// A path under public/, e.g. /uploads/chart.png. A plain string rather than
		// Astro's image() helper so the CMS can upload it — image() requires the file
		// to sit under src/assets/, which CMS uploads never do. Only used for
		// og:image, so losing image optimisation costs effectively nothing.
		heroImage: z.string().optional(),
	}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		/** Ascending. Reordering the projects page is editing these numbers. */
		order: z.number(),
		blurb: z.string(),
		detail: z.string(),
		stack: z.array(z.string()),
		links: z.array(linkSchema),
	}),
});

const experience = defineCollection({
	loader: glob({ base: './src/content/experience', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		org: z.string(),
		location: z.string(),
		/** Free text, e.g. 'Dec 2025 — Jun 2026'. Not a date range: it is display copy. */
		period: z.string(),
		order: z.number(),
		bullets: z.array(z.string()),
	}),
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
	schema: z.object({
		heading: z.string(),
		lede: z.string(),
		description: z.string().optional(),
		// Home only.
		metrics: z
			.array(
				z.object({
					label: z.string(),
					value: z.string(),
					/** Highlights the value in the accent colour. At most one per page. */
					accent: z.boolean().optional(),
				}),
			)
			.optional(),
		ctaLabel: z.string().optional(),
		ctaHref: z.string().optional(),
		writingHeading: z.string().optional(),
		allPostsLabel: z.string().optional(),
		// About only.
		education: z
			.object({
				degree: z.string(),
				school: z.string(),
				period: z.string(),
			})
			.optional(),
		skills: z.array(z.object({ group: z.string(), items: z.string() })).optional(),
		certificates: z.array(z.string()).optional(),
	}),
});

const settings = defineCollection({
	loader: glob({ base: './src/content/settings', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		github: z.string(),
		linkedin: z.string(),
		email: z.string(),
	}),
});

export const collections = { blog, projects, experience, pages, settings };
