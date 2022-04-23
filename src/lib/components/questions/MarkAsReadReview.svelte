<svelte:options immutable />

<script lang="ts">
	import type { MarkAsReadPrivate } from '$lib/types';
	import type { Result } from '@prisma/client';
	import MarkAsReadContent from './MarkAsReadContent.svelte';
	import Review from './Review.svelte';

	export let result: Result;

	$: prompt = result.prompt as unknown as MarkAsReadPrivate;
</script>

<Review>
	<MarkAsReadContent slot="content" {prompt} />
	<slot slot="extra" name="extra" />
</Review>
