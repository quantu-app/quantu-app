<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;
	export let chapter: StateChapter;
</script>

<div class="col-6 col-md-3 mt-4">
	<div class="card">
		{#if chapter.logo}
			<img
				class="card-img-top"
				src={`${base}/api/assets/${chapter.logoId}`}
				alt={chapter.logo.name}
			/>
		{/if}
		<div class="card-body">
			<h4 class="card-title">
				<a
					class="link-dark"
					href={`${base}/creator/departments/${department.id}/chapters/${chapter.id}`}
					>{chapter.name} - {chapter.url}</a
				>
			</h4>
			<div class="card-text">
				<RichViewer value={chapter.description} />
			</div>
		</div>
	</div>
</div>
