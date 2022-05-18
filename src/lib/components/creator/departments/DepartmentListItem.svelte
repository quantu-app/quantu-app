<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;
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
		</div>
	</div>
</div>
