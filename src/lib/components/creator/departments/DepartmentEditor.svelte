<script lang="ts">
	import RichEditor from '$lib/components/Editor/RichEditor.svelte';
	import type { Department } from '@prisma/client';

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
<hr />
<div class="row">
	<div class="col-md">
		<label for="department-description" class="form-label">Description</label>
		<RichEditor id="department-description" bind:value={department.description} />
	</div>
</div>
