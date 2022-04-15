<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import type { Department } from '@prisma/client';
	import SelectAsset from '../assets/SelectAsset.svelte';

	export let department: Partial<Department>;
	export let disabled = false;
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
			{disabled}
			bind:value={department.url}
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
