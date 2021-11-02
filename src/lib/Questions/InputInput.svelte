<script lang="ts">
	import type { QuestionInput } from '$lib/api/quantu-app-api';

	export let prompt: QuestionInput;
	export let input: string;
	export let correct: boolean | undefined = undefined;
	export let disabled = false;
</script>

<div class="input-group">
	<input
		type="text"
		class="form-control"
		class:is-invalid={correct === false}
		placeholder="Type answer"
		{disabled}
		bind:value={input}
	/>
</div>
