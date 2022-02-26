<script lang="ts">
	import type { Challenge } from '@prisma/client';
	import { ChallengeType } from '@prisma/client';
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
		<label for="challenge-url" class="form-label">Challenge Url</label>
		<input
			id="challenge-url"
			type="text"
			class="form-control"
			placeholder="Challenge Url"
			{disabled}
			bind:value={challenge.url}
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
			<option value={ChallengeType.MULTIPLE_CHOICE}>Multiple Choice</option>
			<option value={ChallengeType.INPUT}>Input</option>
			<option value={ChallengeType.FLASH_CARD}>Flash Card</option>
		</select>
	</div>
</div>

<PromptEditor {disabled} type={challenge.type} {prompt} />
