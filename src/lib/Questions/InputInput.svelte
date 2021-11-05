<script lang="ts">
	export let input: string;
	export let correct: boolean | undefined = undefined;
	export let disabled = false;
</script>

<div class="input-group">
	<input
		type="text"
		class="form-control"
		class:is-valid={correct === true}
		class:is-invalid={correct === false}
		placeholder="Type answer"
		{disabled}
		bind:value={input}
	/>
</div>
