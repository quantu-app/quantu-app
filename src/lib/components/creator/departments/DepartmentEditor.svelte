<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import { validDepartmentUrl } from '$lib/state/creator/departments';
	import { isUrlSafe } from '$lib/utils';
	import { debounce } from '@aicacia/debounce';
	import type { Department } from '@prisma/client';
	import SelectAsset from '../assets/SelectAsset.svelte';

	export let department: Partial<Department>;
	export let disabled = false;

	let departmentUrl = department.url;
	let validUrl: boolean = false;

	$: validUrl = isUrlSafe(department.url);

	let validatingUrl = false;
	async function onUrlChange() {
		if (!validUrl || validatingUrl || departmentUrl === department.url) {
			return;
		}
		validatingUrl = true;
		try {
			validUrl = await validDepartmentUrl(department.url);
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
			bind:value={department.name}
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
			bind:value={department.url}
			on:change={debouncedOnUrlChange}
		/>
	</div>
</div>
<hr />
<div class="row">
	{#if department.id}
		<div class="col-md-3">
			<div class="form-control">
				<label for="department-logo" class="form-label">Logo</label>
				<SelectAsset
					id="department-logo"
					departmentId={department.id}
					bind:assetId={department.logoId}
					type="IMAGE"
				/>
			</div>
		</div>
	{/if}
	<div class="col-md-9">
		<label for="department-description" class="form-label">Description</label>
		<RichEditor id="department-description" bind:value={department.description} />
	</div>
</div>
