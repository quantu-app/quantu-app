<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import ChallengeListItem from '$lib/components/Challenges/ChallengeListItem.svelte';

	export let questions: Question[];
</script>

<div class="container">
	{#each questions as question}
		<ChallengeListItem {question} />
	{/each}
</div>
