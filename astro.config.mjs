// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

/**
 * Wrap every markdown-generated <table> in <div class="table-scroll"> so wide
 * tables can scroll horizontally instead of being crushed on narrow screens.
 *
 * Markdown has no syntax for wrapping its own output, and the CSS-only
 * alternative (`table { display: block; white-space: nowrap }`) costs the
 * element its table layout semantics. Doing it here keeps the table a table and
 * puts the overflow on a wrapper where it belongs.
 */
function rehypeWrapTables() {
	/** @param {any} node */
	const walk = (node) => {
		if (!Array.isArray(node.children)) return;
		node.children = node.children.map((/** @type {any} */ child) => {
			walk(child);
			if (child.type === 'element' && child.tagName === 'table') {
				return {
					type: 'element',
					tagName: 'div',
					properties: { className: ['table-scroll'] },
					children: [child],
				};
			}
			return child;
		});
	};
	/** @param {any} tree */
	return (tree) => {
		walk(tree);
	};
}

// https://astro.build/config
export default defineConfig({
	// Must match the deployed origin exactly: the RSS feed, sitemap and canonical
	// tags are built from it, and a stale value fails silently with a green build.
	// Shape is <worker-name>.<account-subdomain>.workers.dev — worker name comes
	// from `name` in wrangler.jsonc.
	site: 'https://srijan-ratrey.sr5.workers.dev',
	integrations: [mdx(), sitemap()],
	markdown: {
		rehypePlugins: [rehypeWrapTables],
	},
	fonts: [
		{
			// Inter, the neutral grotesk the Swiss treatment needs. Astro self-hosts
			// this at build time, so there is no runtime Google Fonts request.
			// Weights 400 and 500 only — nothing here uses 600 or 700.
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-inter',
			fallbacks: ['-apple-system', 'Helvetica Neue', 'Arial', 'sans-serif'],
			weights: [400, 500],
			styles: ['normal'],
			subsets: ['latin'],
		},
		{
			// Atkinson is no longer used for body text and is not preloaded, but the
			// files and this entry stay wired up rather than churning them out.
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
