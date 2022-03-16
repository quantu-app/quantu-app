<script context="module" lang="ts">
	// see: https://developers.google.com/search/docs/advanced/robots/robots_meta_tag
	// currently we don't support or care about parameterized directives so they are not included.
	export type TagDirective =
		| 'all'
		| 'noindex'
		| 'nofollow'
		| 'none'
		| 'noarchive'
		| 'nositelinkssearchbox'
		| 'nosnippet'
		| 'indexifembedded'
		| 'notranslate'
		| 'noimageindex';
</script>

<script lang="ts">
	export let directives: TagDirective[] = [];

	const joinedDirectives = directives.join(', ');
</script>

{#if directives && directives.length > 0}
	<meta name="robots" content={joinedDirectives} />
{/if}
