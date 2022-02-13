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
	import type { Unit, UnitChildList } from '$lib/api/quantu-app-api';
	import Search from '$lib/components/Search.svelte';
	import { debounce } from '@aicacia/debounce';
	import { updateUnit } from '$lib/state/organizationUnits';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Tags from '$lib/components/Tags.svelte';
	import CreateChild from './CreateChild.svelte';
	import ChildList from './ChildList.svelte';
	import RichEditor from '$lib/components/RichEditor.svelte';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let unit: Unit;
	export let children: UnitChildList;

	function onNameChange() {
		updateUnit(organizationId, unit.id, {
			courseId,
			name: unit.name
		});
	}

	let updatingTags = false;
	function onTagsChange() {
		updatingTags = true;
		updateUnit(organizationId, unit.id, {
			courseId,
			tags: unit.tags
		}).finally(() => {
			updatingTags = false;
		});
	}

	const debouncedUpdateDescription = debounce(
		() =>
			updateUnit(organizationId, unit.id, {
				courseId,
				description: unit.description
			}),
		3000
	);

	let updatingPublished = false;
	function onPublishedChange() {
		updatingPublished = true;
		unit.published = !unit.published;
		updateUnit(organizationId, unit.id, {
			courseId,
			published: unit.published
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
					<label for="unit-name" class="form-label">Unit Name</label>
					<input
						id="unit-name"
						type="text"
						class="form-control"
						placeholder="Enter Name"
						bind:value={unit.name}
						on:change={onNameChange}
					/>
				</div>
				<div class="col-md">
					<label for="unit-tags" class="form-label mb-0">Unit Tags</label>
					<Tags
						id="unit-tags"
						bind:tags={unit.tags}
						loading={updatingTags}
						on:change={debouncedOnTagsChange}
					/>
				</div>
			</form>
		</div>
		<div class="col-md">
			<div class="d-flex mt-2 justify-content-end">
				<CreateChild {organizationId} {courseId} {unit} />
				<div class="p-1" />
				<button
					type="button"
					class="btn"
					class:btn-primary={unit.published}
					class:btn-outline-primary={!unit.published}
					disabled={updatingPublished}
					on:click={onPublishedChange}
				>
					{#if unit.published}
						<i class="bi bi-eye" />
					{:else}
						<i class="bi bi-eye-slash" />
					{/if}
				</button>
			</div>
		</div>
	</div>
	<div class="mt-2">
		<label for="unit-description">Description</label>
		<RichEditor bind:content={unit.description} on:change={debouncedUpdateDescription} />
	</div>
</div>

<div class="container">
	<Search bind:filter={$state.unitNameFilter} />
</div>
<div class="container">
	<ChildList {organizationId} {courseId} unitId={unit.id} children={children.filter(filter)}>
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
	</ChildList>
</div>
