<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import { validChapterUrl } from '$lib/state/creator/chapters';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { isUrlSafe } from '$lib/utils';
	import { debounce } from '@aicacia/debounce';
	import type { Chapter } from '@prisma/client';
	import SelectAsset from '../assets/SelectAsset.svelte';

	export let chapterChange: Partial<Chapter>;
	export let disabled = false;

	let chapterUrl = chapterChange.url;
	let validUrl: boolean = false;

	$: validUrl = !!chapterChange.url && isUrlSafe(chapterChange.url);

	let validatingUrl = false;
	async function onUrlChange() {
		if (!validUrl || validatingUrl || chapterUrl === chapterChange.url) {
			return;
		}
		validatingUrl = true;
		try {
			validUrl = await validChapterUrl(chapterChange.url as string);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error validating URL',
				description: (e as Error).message
			});
		} finally {
			validatingUrl = false;
		}
	}
	const debouncedOnUrlChange = debounce(onUrlChange, 300);
</script>

<div class="row">
	<div class="col-md">
		<label for="chapter-name" class="form-label">Name</label>
		<input
			id="chapter-name"
			type="text"
			class="form-control"
			placeholder="Chapter Name"
			{disabled}
			bind:value={chapterChange.name}
		/>
	</div>
	<div class="col-md">
		<label for="chapter-url" class="form-label">URL</label>
		<input
			id="chapter-url"
			type="text"
			class="form-control"
			placeholder="Chapter URL"
			class:is-invalid={!validUrl}
			{disabled}
			bind:value={chapterChange.url}
			on:change={debouncedOnUrlChange}
		/>
	</div>
</div>
<hr />
<div class="row">
	{#if chapterChange.id}
		<div class="col-md-3">
			<div class="form-control">
				<label for="chapter-logo" class="form-label">Logo</label>
				<SelectAsset
					id="chapter-logo"
					chapterId={chapterChange.id}
					bind:assetId={chapterChange.logoId}
					type="IMAGE"
				/>
			</div>
		</div>
	{/if}
	<div class="col">
		<label for="chapter-description" class="form-label">Description</label>
		<RichEditor id="chapter-description" bind:value={chapterChange.description} />
	</div>
</div>
