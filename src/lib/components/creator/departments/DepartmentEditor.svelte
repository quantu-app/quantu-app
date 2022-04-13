<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import type { Department } from '@prisma/client';
	import SelectAsset from '../assets/SelectAsset.svelte';

	export let department: Partial<Department>;
	export let disabled = false;
</script>

<div class="row">
	<div class="col-md">
		<label for="department-name" class="form-label">Department Name</label>
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
		<label for="department-url" class="form-label">Department URL</label>
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
{#if department.id}
	<div class="row mt-2">
		<div class="col-md">
			<div class="form-control">
				<SelectAsset
					id="department-logo"
					departmentId={department.id}
					bind:assetId={department.logoId}
					type="IMAGE">Select/Upload Department Logo</SelectAsset
				>
				{#if department.logoId}
					<img src={`/api/assets/${department.logoId}`} />
				{/if}
			</div>
		</div>
	</div>
{/if}
<hr />
<div class="row">
	<div class="col-md">
		<label for="department-description" class="form-label">Description</label>
		<RichEditor id="department-description" bind:value={department.description} />
	</div>
</div>
