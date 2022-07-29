<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import { validCourseUrl } from '$lib/state/creator/courses';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { isUrlSafe } from '$lib/utils';
	import { debounce } from '@aicacia/debounce';
	import type { Course } from '@prisma/client';
	import SelectAsset from '../assets/SelectAsset.svelte';

	export let courseChange: Partial<Course>;
	export let disabled = false;

	let courseUrl = courseChange.url;
	let validUrl: boolean = false;

	$: validUrl = !!courseChange.url && isUrlSafe(courseChange.url);

	let validatingUrl = false;
	async function onUrlChange() {
		if (!validUrl || validatingUrl || courseUrl === courseChange.url) {
			return;
		}
		validatingUrl = true;
		try {
			validUrl = await validCourseUrl(courseChange.url as string);
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
		<label for="course-name" class="form-label">Name</label>
		<input
			id="course-name"
			type="text"
			class="form-control"
			placeholder="Course Name"
			{disabled}
			bind:value={courseChange.name}
		/>
	</div>
	<div class="col-md">
		<label for="course-url" class="form-label">URL</label>
		<input
			id="course-url"
			type="text"
			class="form-control"
			placeholder="Course URL"
			class:is-invalid={!validUrl}
			{disabled}
			bind:value={courseChange.url}
			on:change={debouncedOnUrlChange}
		/>
	</div>
</div>
<hr />
<div class="row">
	{#if courseChange.id}
		<div class="col-md-3">
			<div class="form-control">
				<label for="course-logo" class="form-label">Logo</label>
				<SelectAsset
					id="course-logo"
					courseId={courseChange.id}
					bind:assetId={courseChange.logoId}
					type="IMAGE"
				/>
			</div>
		</div>
	{/if}
	<div class="col">
		<label for="course-description" class="form-label">Description</label>
		<RichEditor id="course-description" bind:value={courseChange.description} />
	</div>
</div>
