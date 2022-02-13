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
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import UnitList from './UnitList.svelte';
	import type { Unit } from '$lib/api/quantu-app-api';
	import Search from '$lib/components/Search.svelte';
	import CreateUnit from './CreateUnit.svelte';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let units: Unit[];

	$: filter = (unit: Unit) =>
		$state.unitNameFilter ? fuzzyEquals($state.unitNameFilter, unit.name) : true;
</script>

<div class="container mb-2">
	<div class="d-flex justify-content-end">
		<CreateUnit {organizationId} {courseId} />
	</div>
	<Search bind:filter={$state.unitNameFilter} />
</div>

<div class="container">
	<UnitList {organizationId} {courseId} units={units.filter(filter)} />
</div>
