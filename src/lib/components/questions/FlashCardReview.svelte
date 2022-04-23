<svelte:options immutable />

<script lang="ts">
	import FlashCardInput from './FlashCardInput.svelte';
	import FlashCardContent from './FlashCardContent.svelte';
	import Review from './Review.svelte';
	import type { Result } from '@prisma/client';
	import type { FlashCard, FlashCardAnswer } from '$lib/types';

	export let result: Result;

	$: prompt = result.prompt as unknown as FlashCard;
	$: input = result.answer as FlashCardAnswer;
</script>

<Review>
	<FlashCardContent slot="content" shown {prompt} />
	<FlashCardInput slot="input" shown disabled={true} {input} />
	<slot slot="extra" name="extra" />
</Review>
