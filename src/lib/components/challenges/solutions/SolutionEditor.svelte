<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import type { StateChallengeSolution } from '$lib/state/challengeSolutions';

	export let solution: Partial<StateChallengeSolution> = {};
</script>

<RichEditor bind:value={solution.solution} placeholder="Type Your Solution..." showHelper />
