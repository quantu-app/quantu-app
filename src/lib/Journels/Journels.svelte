<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		journelNameFilter: string | undefined;
	}

	const state = writable<IState>({
		journelNameFilter: undefined
	});
</script>

<script lang="ts">
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import { beforeUpdate } from 'svelte';
	import { journels, deleteJournel } from '$lib/state/journels';
	import DeleteJournel from '$lib/Journels/DeleteJournel.svelte';
	import SearchBar from '$lib/Journels/SearchBar.svelte';
	import JournelList from './JournelList.svelte';
	import type { Journel } from '$lib/api/quantu-app-api';

	let prevJournelNameFilter: string = $state.journelNameFilter;

	let deleteJournelId: string;
	let journelToDelete: Journel;

	$: list = Object.entries($journels).filter(filter).sort(sort);

	function filter([_localId, journel]: [string, Journel]) {
		return $state.journelNameFilter ? fuzzyEquals($state.journelNameFilter, journel.name) : true;
	}

	function sort(
		[_aLocalId, aJournel]: [string, Journel],
		[_bLocalId, bJournel]: [string, Journel]
	) {
		let aValue = new Date(aJournel.insertedAt),
			bValue = new Date(bJournel.insertedAt);
		return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
	}

	function createOnDelete(journelId: string, journel: Journel) {
		return function onDelete() {
			deleteJournelId = journelId;
			journelToDelete = journel;
		};
	}

	function onDeleteJournel() {
		if (deleteJournelId) {
			deleteJournel(deleteJournelId);
			journelToDelete = undefined;
		}
	}

	beforeUpdate(() => {
		if ($state.journelNameFilter !== prevJournelNameFilter) {
			list = Object.entries($journels).filter(filter).sort(sort);
		}
	});
</script>

<SearchBar bind:journelNameFilter={$state.journelNameFilter} />

<DeleteJournel {journelToDelete} {onDeleteJournel} />

<div class="w-100">
	<JournelList journels={list} {createOnDelete} />
</div>
