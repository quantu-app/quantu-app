<script lang="ts">
	import type { Challenge } from '@prisma/client';
	import PromptEditor from '../prompts/PromptEditor.svelte';

	export let challenge: Partial<Challenge>;
	export let disabled = false;

	$: prompt = challenge.prompt as any;
</script>

<div class="row">
	<div class="col-md">
		<label for="challenge-name" class="form-label">Challenge Name</label>
		<input
			id="challenge-name"
			type="text"
			class="form-control"
			placeholder="Challenge Name"
			{disabled}
			bind:value={challenge.name}
		/>
	</div>
	<div class="col-md">
		<label for="challenge-type" class="form-label">Challenge Type</label>
		<select
			id="challenge-type"
			class="form-select"
			bind:value={challenge.type}
			aria-label="Challenge Type"
		>
			<option value="multiple_choice">Multiple Choice</option>
			<option value="input">Input</option>
			<option value="mark_as_read">Mark as Read</option>
			<option value="flash_card">Flash Card</option>
		</select>
	</div>
</div>

<PromptEditor {disabled} type={challenge.type} {prompt} />
