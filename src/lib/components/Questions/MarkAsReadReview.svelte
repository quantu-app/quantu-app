<script lang="ts">
	import type { QuestionResult, QuestionMarkAsReadPrivate } from '$lib/api/quantu-app-api';
	import MarkAsReadContent from './MarkAsReadContent.svelte';
	import Review from './Review.svelte';

	export let result: QuestionResult;

	$: prompt = result.prompt as QuestionMarkAsReadPrivate;
</script>

<Review>
	<MarkAsReadContent slot="content" {prompt} />
	<slot slot="extra" name="extra" />
</Review>
