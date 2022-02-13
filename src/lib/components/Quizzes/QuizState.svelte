<script lang="ts">
	import { QuestionState } from '$lib/state/play';

	export let results: (QuestionState | undefined)[];
</script>

<div class="d-flex flex-row">
	{#each results as result, index}
		<div class="me-1">
			<span
				class="badge"
				class:bg-success={result === QuestionState.Correct}
				class:bg-danger={result === QuestionState.Incorrect}
				class:bg-primary={result === QuestionState.Current}
				class:bg-secondary={result === undefined}>{index + 1}</span
			>
		</div>
	{/each}
</div>
