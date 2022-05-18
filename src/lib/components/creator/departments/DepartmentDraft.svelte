<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	import {
		mergeDepartmentDraft,
		updateDepartmentDraft,
		type StateDepartmentDraft
	} from '$lib/state/creator/departmentDrafts';
	import DepartmentDraftEditor from './DepartmentDraftEditor.svelte';

	export let departmentDraft: StateDepartmentDraft;

	let updating = false;
	async function onUpdate() {
		updating = true;
		try {
			await updateDepartmentDraft(departmentDraft.id, {
				name: departmentDraft.name,
				url: departmentDraft.url,
				description: departmentDraft.description,
				logoId: departmentDraft.logoId
			});
		} finally {
			updating = false;
		}
	}

	let merging = false;
	async function onMerge() {
		merging = true;
		try {
			const department = await mergeDepartmentDraft(departmentDraft.id);
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
		<DepartmentDraftEditor {departmentDraft} />
	</div>

	<div class="d-flex justify-content-end">
		<button type="button" on:click={onUpdate} class="btn btn-primary" disabled={updating}
			>Save Draft</button
		>
	</div>
</div>
