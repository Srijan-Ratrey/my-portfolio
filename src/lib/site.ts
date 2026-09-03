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

/*
  Sort key for the two hand-ordered collections, projects and experience. Orders are
  deliberately sparse — 10, 20, 30 — so inserting an entry is a one-file edit and never
  a renumbering of its siblings; to put something first, give it anything below 10. The
  card numbers on the page are positional, so they close up on their own.

  The fallbacks matter: without them two entries claiming the same number are left in glob
  order, which is alphabetical by filename today and is not a promise. `id` comes last
  because it is the only field guaranteed unique, which makes the comparator total — title
  alone is not enough, as both experience roles are called "AI/ML Intern".
*/
export const byOrder = <T extends { id: string; data: { order: number; title: string } }>(
	a: T,
	b: T,
) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title) || a.id.localeCompare(b.id);
