<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		courseChangeNameFilter: string;
	}

	const state = writable<IState>({
		courseChangeNameFilter: ''
	});
</script>

<script lang="ts">
	import CourseChangeList from './CourseChangeList.svelte';
	import CreateCourseChange from './CreateCourseChange.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { StateChange } from '$lib/state/creator/changes';

	export let courseChanges: StateChange[];

	function onChange(courseChangeNameFilter: string) {
		state.update((state) => ({
			...state,
			courseChangeNameFilter
		}));
	}
	$: courseChangeNameFilter = $state.courseChangeNameFilter;
	$: filter = (change: StateChange) =>
		courseChangeNameFilter ? fuzzyEquals(courseChangeNameFilter, change.name) : true;
	$: filteredCourseChanges = courseChanges.filter((change) => change.latest).filter(filter);
</script>

<div class="container mb-8">
	<div class="d-flex justify-content-end mt-2">
		<CreateCourseChange />
	</div>
	<Search filter={courseChangeNameFilter} {onChange} />
	<CourseChangeList courseChanges={filteredCourseChanges} />
</div>
