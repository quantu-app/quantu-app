<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import {
		mergeDepartmentChange,
		updateDepartmentChange,
		type StateDepartmentChange
	} from '$lib/state/creator/departmentChanges';
	import DepartmentChangeEditor from './DepartmentChangeEditor.svelte';

	export let departmentChange: StateDepartmentChange;

	let updating = false;
	async function onUpdate() {
		updating = true;
		try {
			await updateDepartmentChange(departmentChange.id, {
				name: departmentChange.name,
				url: departmentChange.url,
				description: departmentChange.description,
				logoId: departmentChange.logoId
			});
		} finally {
			updating = false;
		}
	}

	let merging = false;
	async function onMerge() {
		merging = true;
		try {
			const { department } = await mergeDepartmentChange(departmentChange.id);
			await goto(`${base}/creator/departments/${department.id}`);
		} finally {
			merging = false;
		}
	}
</script>

<div class="container mb-8">
	<div class="d-flex justify-content-end">
		<button type="button" on:click={onMerge} class="btn btn-primary" disabled={updating || merging}
			>Merge</button
		>
	</div>

	<div class="my-2">
		<DepartmentChangeEditor {departmentChange} />
	</div>

	<div class="d-flex justify-content-end">
		<button type="button" on:click={onUpdate} class="btn btn-primary" disabled={updating}
			>Save Change</button
		>
	</div>
</div>
