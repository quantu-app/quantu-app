<script lang="ts">
	import ChallengeListItem from '$lib/components/challenges/ChallengeListItem.svelte';
	import type { Challenge, Topic } from '@prisma/client';
	export let challenges: Array<Challenge & { topic: Topic }>;
</script>

<div class="container">
	{#each challenges as challenge}
		<ChallengeListItem {challenge} />
	{/each}
</div>
