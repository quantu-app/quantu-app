<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { StateDepartmentDraft } from '$lib/state/creator/departmentDrafts';

	export let departmentDraft: StateDepartmentDraft;
</script>

<div class="col-6 col-md-3 mt-4">
	<div class="card">
		{#if departmentDraft.logoId}
			<img
				class="card-img-top"
				src={`${base}/api/assets/${departmentDraft.logoId}`}
				alt={departmentDraft.logo.name}
			/>
		{/if}
		<div class="card-body">
			<h4 class="card-title">
				<a class="link-dark" href={`${base}/creator/departments/drafts/${departmentDraft.id}`}
					>{departmentDraft.name} - {departmentDraft.url}</a
				>
			</h4>
			<div class="card-text">
				<RichViewer value={departmentDraft.description} />
			</div>
		</div>
	</div>
</div>
