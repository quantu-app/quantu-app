<script lang="ts">
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import PromptEditor from '../prompts/PromptEditor.svelte';
	import RichEditor from '$lib/components/Editor/RichEditor.svelte';
	import DateTimeInput from '../../DateTimeInput.svelte';

	export let challenge: Partial<StateChallenge>;
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
			<option value={'MULTIPLE_CHOICE'}>Multiple Choice</option>
			<option value={'INPUT'}>Input</option>
			<option value={'FLASH_CARD'}>Flash Card</option>
		</select>
	</div>
</div>

<div class="row mt-2 mb-4">
	<div class="col-6">
		<label for="challenge-releasedAt" class="form-label">Release At</label>
		<DateTimeInput id="challenge-releasedAt" bind:date={challenge.releasedAt} {disabled} />
	</div>

	<div class="col-6">
		<label for="challenge-description" class="form-label">Description</label>
		<RichEditor id="challenge-description" bind:content={challenge.description} />
	</div>

	<div class="col-md">
		<label for="challenge-visible" class="form-label">Visible</label><br />
		<input
			class="form-check-input"
			type="checkbox"
			bind:checked={challenge.visible}
			id="flexCheckDefault"
		/>
	</div>
</div>

<PromptEditor {disabled} type={challenge.type} {prompt} />
