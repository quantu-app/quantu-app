<script lang="ts">
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import PromptEditor from '../prompts/PromptEditor.svelte';
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import DateTimeInput from '../../DateTimeInput.svelte';
	import { isUrlSafe } from '../../../utils';
	import SelectAsset from '../assets/SelectAsset.svelte';

	export let challenge: Partial<StateChallenge>;
	export let disabled = false;

	const MAX_NAME_LEN: number = 50;

	let validUrl: boolean = false;

	$: prompt = challenge.prompt as any;
	$: validUrl = isUrlSafe(challenge.url);
	$: nameTooLong = (challenge.name || '').length > MAX_NAME_LEN;
</script>

<div class="row">
	<div class="col-md">
		<label for="challenge-name" class="form-label">Challenge Name</label>
		<input
			id="challenge-name"
			type="text"
			class={`form-control${nameTooLong ? ' is-invalid' : ''}`}
			placeholder="Challenge Name"
			{disabled}
			bind:value={challenge.name}
		/>
		{#if nameTooLong}
			<div class="invalid-feedback">
				Character Limit reached: {challenge.name.length - MAX_NAME_LEN} too many.
			</div>
		{/if}
	</div>
	<div class="col-md">
		<label for="challenge-url" class="form-label">Challenge Url</label>
		<input
			id="challenge-url"
			type="text"
			class={`form-control${validUrl ? '' : ' is-invalid'}`}
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
		<RichEditor id="challenge-description" bind:value={challenge.description} />
	</div>
</div>

<div class="row mt-2 mb-4">
	<div class="col-3">
		<div class="form-control">
			<label for="challenge-logo" class="form-label">Logo</label>
			<SelectAsset
				id="challenge-logo"
				departmentId={challenge.departmentId}
				bind:assetId={challenge.logoId}
				type="IMAGE"
			/>
		</div>
	</div>
	<div class="col">
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
