<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		unitNameFilter: string | undefined;
	}

	const state = writable<IState>({
		unitNameFilter: undefined
	});
</script>

<script lang="ts">
	import type { Course, Unit } from '$lib/api/quantu-app-api';
	import Search from '$lib/components/Search.svelte';
	import { debounce } from '@aicacia/debounce';
	import { updateCourse } from '$lib/state/organizationCourses';
	import UnitList from '$lib/components/UserOrganizations/Units/UnitList.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Tags from '$lib/components/Tags.svelte';
	import CreateUnit from './CreateUnit.svelte';
	import RichEditor from '$lib/components/RichEditor.svelte';

	export let organizationId: number;
	export let course: Course;
	export let units: Unit[];

	function onNameChange() {
		updateCourse(organizationId, course.id, {
			name: course.name
		});
	}

	let updatingTags = false;
	function onTagsChange() {
		updatingTags = true;
		updateCourse(organizationId, course.id, {
			tags: course.tags
		}).finally(() => {
			updatingTags = false;
		});
	}

	const debouncedUpdateDescription = debounce(
		() =>
			updateCourse(organizationId, course.id, {
				description: course.description
			}),
		3000
	);

	let updatingPublished = false;
	function onPublishedChange() {
		updatingPublished = true;
		course.published = !course.published;
		updateCourse(organizationId, course.id, {
			published: course.published
		}).finally(() => {
			updatingPublished = false;
		});
	}

	const debouncedOnTagsChange = debounce(onTagsChange, 3000);

	$: filter = (unit: Unit) =>
		$state.unitNameFilter ? fuzzyEquals($state.unitNameFilter, unit.name) : true;
</script>

<div class="container mb-2">
	<div class="row justify-content-between">
		<div class="col-md">
			<form class="row" on:submit|preventDefault>
				<div class="col-md">
					<label for="course-name" class="form-label">Course Name</label>
					<input
						id="course-name"
						type="text"
						class="form-control"
						placeholder="Enter Name"
						bind:value={course.name}
						on:change={onNameChange}
					/>
				</div>
				<div class="col-md">
					<label for="course-tags" class="form-label mb-0">Course Tags</label>
					<Tags
						id="course-tags"
						bind:tags={course.tags}
						loading={updatingTags}
						on:change={debouncedOnTagsChange}
					/>
				</div>
			</form>
		</div>
		<div class="col-md">
			<div class="d-flex mt-2 justify-content-end">
				<CreateUnit {organizationId} {course} />
				<div class="p-1" />
				<button
					type="button"
					class="btn"
					class:btn-primary={course.published}
					class:btn-outline-primary={!course.published}
					disabled={updatingPublished}
					on:click={onPublishedChange}
				>
					{#if course.published}
						<i class="bi bi-eye" />
					{:else}
						<i class="bi bi-eye-slash" />
					{/if}
				</button>
			</div>
		</div>
	</div>
	<div class="mt-2">
		<label for="course-description">Description</label>
		<RichEditor bind:content={course.description} on:change={debouncedUpdateDescription} />
	</div>
</div>

<div class="container">
	<Search bind:filter={$state.unitNameFilter} />
</div>
<div class="container">
	<UnitList {organizationId} courseId={course.id} units={units.filter(filter)} showIndices>
		<svelte:fragment slot="dropdown" let:unit let:onUpdate let:onDelete>
			<li>
				<button
					type="button"
					class="dropdown-item justify-content-between"
					data-bs-toggle="modal"
					data-bs-target="#update-unit"
					aria-label="Update"
					on:click={onUpdate}>Update</button
				>
			</li>
			<li slot="dropdown" let:unit>
				<button
					type="button"
					class="dropdown-item justify-content-between"
					data-bs-toggle="modal"
					data-bs-target="#delete-unit"
					aria-label="Delete"
					on:click={onDelete}>Delete</button
				>
			</li>
		</svelte:fragment>
	</UnitList>
</div>
