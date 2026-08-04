import { getCollection } from 'astro:content';

/**
 * Site-wide settings, editable at src/content/settings/site.md (and via /admin).
 *
 * This replaced a plain `consts.ts` of exported strings. Content collections are
 * async, so the values cannot be read at module scope — every consumer awaits
 * this instead. Astro components and endpoints can both await in their frontmatter,
 * so that costs one line at each call site and keeps a single source of truth.
 *
 * Deliberately no phone number. See the note in site.md.
 */
export async function getSite() {
	const entries = await getCollection('settings');
	const site = entries.find((e) => e.id === 'site');
	if (!site) {
		throw new Error(
			'Missing src/content/settings/site.md — site title, description and links come from there.',
		);
	}
	return site.data;
}
