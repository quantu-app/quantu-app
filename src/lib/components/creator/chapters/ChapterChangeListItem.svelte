<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { StateChange } from '$lib/state/creator/changes';
	import { chaptersById } from '$lib/state/creator/chapters';
	import { filterObjectByNullOrUndefined } from '$lib/utils';

	export let chapterChange: StateChange;

	$: chapter = chapterChange.referenceId ? $chaptersById[chapterChange.referenceId] : undefined;
	$: value = Object.assign({}, chapter, filterObjectByNullOrUndefined(chapterChange.value as any));
</script>

<div class="col-6 col-md-3 mt-4">
	<div class="card">
		{#if value.logoId}
			<img class="card-img-top" src={`${base}/api/assets/${value.logoId}`} alt={value.logo.name} />
		{/if}
		<div class="card-body">
			<h4 class="card-title">
				<a class="link-dark" href={`${base}/creator/chapters/changes/${chapterChange.id}`}
					>{chapterChange?.name} - {value.name} {value.url}</a
				>
			</h4>
			<div class="card-text">
				<RichViewer value={value.description} />
			</div>
			<p class="m-0">{chapterChange.updatedAt.toLocaleString()}</p>
		</div>
	</div>
</div>
