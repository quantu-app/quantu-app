<script context="module" lang="ts">
	export type CardType = 'summary' | 'summary_large_image' | 'app' | 'player';
</script>

<script lang="ts">
	// see: https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started
	export let title: string = undefined;
	export let card: CardType = undefined;
	export let description: string = undefined;
	export let image: string = undefined;
	export let imageAlt: string = undefined;
</script>

<meta property="twitter:site" content="@QUANTU_APP" />
<meta property="twitter:creator" content="@QUANTU_APP" />
<meta name="twitter:card" content={card || 'summary'} />
{#if title}
	<meta property="twitter:title" content={title} />
{/if}
{#if description}
	<meta property="twitter:description" content={description} />
{/if}
{#if image}
	<meta property="twitter:image" content={image} />
{/if}
{#if imageAlt}
	<meta property="twitter:image:alt" content={imageAlt} />
{/if}
