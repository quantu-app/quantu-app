<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';

	import { base } from '$app/paths';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import { createDepartmentDraftFromRef } from '$lib/state/creator/departmentDrafts';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;

	let creatingDraft = false;
	async function onCreateDraft() {
		creatingDraft = true;
		try {
			const departmentDraft = await createDepartmentDraftFromRef(department.id);
			await goto(`${base}/creator/drafts/departments/${department.id}/${departmentDraft.id}`);
		} finally {
			creatingDraft = false;
		}
	}
</script>

<div class="col-6 col-md-3 mt-4">
	<div class="card">
		{#if department.logoId}
			<img
				class="card-img-top"
				src={`${base}/api/assets/${department.logoId}`}
				alt={department.logo.name}
			/>
		{/if}
		<div class="card-body">
			<h4 class="card-title">
				<a class="link-dark" href={`${base}/creator/departments/${department.id}`}
					>{department.name} - {department.url}</a
				>
			</h4>
			<div class="card-text">
				<RichViewer value={department.description} />
			</div>
			<button
				type="button"
				class="btn btn-sm btn-primary"
				aria-label="Create Draft"
				disabled={creatingDraft}
				on:click={onCreateDraft}>Create Draft</button
			>
		</div>
	</div>
</div>
