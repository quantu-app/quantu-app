<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import type { StateDepartmentDraft } from '$lib/state/creator/departmentDrafts';
	import { validDepartmentUrl } from '$lib/state/creator/departments';
	import { isUrlSafe } from '$lib/utils';
	import { debounce } from '@aicacia/debounce';
	import SelectAsset from '../assets/SelectAsset.svelte';

	export let departmentDraft: Partial<StateDepartmentDraft>;
	export let disabled = false;

	let departmentUrl = departmentDraft.url;
	let validUrl: boolean = false;

	$: validUrl = isUrlSafe(departmentDraft.url);

	let validatingUrl = false;
	async function onUrlChange() {
		if (!validUrl || validatingUrl || departmentUrl === departmentDraft.url) {
			return;
		}
		validatingUrl = true;
		try {
			validUrl = await validDepartmentUrl(departmentDraft.url);
		} finally {
			validatingUrl = false;
		}
	}
	const debouncedOnUrlChange = debounce(onUrlChange, 300);
</script>

<div class="row">
	<div class="col-md">
		<label for="department-name" class="form-label">Name</label>
		<input
			id="department-name"
			type="text"
			class="form-control"
			placeholder="Department Name"
			{disabled}
			bind:value={departmentDraft.name}
		/>
	</div>
	<div class="col-md">
		<label for="department-url" class="form-label">URL</label>
		<input
			id="department-url"
			type="text"
			class="form-control"
			placeholder="Department URL"
			class:is-invalid={!validUrl}
			{disabled}
			bind:value={departmentDraft.url}
			on:change={debouncedOnUrlChange}
		/>
	</div>
</div>
<hr />
<div class="row">
	{#if departmentDraft.id}
		<div class="col-md-3">
			<div class="form-control">
				<label for="department-logo" class="form-label">Logo</label>
				<SelectAsset
					id="department-logo"
					departmentId={departmentDraft.id}
					bind:assetId={departmentDraft.logoId}
					type="IMAGE"
				/>
			</div>
		</div>
	{/if}
	<div class="col">
		<label for="department-description" class="form-label">Description</label>
		<RichEditor id="department-description" bind:value={departmentDraft.description} />
	</div>
</div>
