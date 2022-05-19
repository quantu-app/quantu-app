<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { StateDepartmentChange } from '$lib/state/creator/departmentChanges';

	export let departmentChange: StateDepartmentChange;
</script>

<div class="col-6 col-md-3 mt-4">
	<div class="card">
		{#if departmentChange.logoId}
			<img
				class="card-img-top"
				src={`${base}/api/assets/${departmentChange.logoId}`}
				alt={departmentChange.logo.name}
			/>
		{/if}
		<div class="card-body">
			<h4 class="card-title">
				<a class="link-dark" href={`${base}/creator/departments/changes/${departmentChange.id}`}
					>{departmentChange.name} - {departmentChange.url}</a
				>
			</h4>
			<div class="card-text">
				<RichViewer value={departmentChange.description} />
			</div>
		</div>
	</div>
</div>
