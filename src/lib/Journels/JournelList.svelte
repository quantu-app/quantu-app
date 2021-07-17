<script lang="ts">
	import type { Journel } from '$lib/api/quantu-app-api';
	import JournelListItem from './JournelListItem.svelte';

	export let journels: [string, Journel][];
	export let createOnDelete: (localId: string, journel: Journel) => () => void;

	$: journelsByMonth = Object.entries(
		journels.reduce<Record<string, [string, Journel][]>>((journelsByMonth, [localId, journel]) => {
			const date = new Date(journel.insertedAt),
				month = new Date(date).toLocaleString('en-us', { month: 'short', year: 'numeric' });

			const monthJournels = journelsByMonth[month] || (journelsByMonth[month] = []);

			monthJournels.push([localId, journel]);
			return journelsByMonth;
		}, {})
	);
</script>

{#each journelsByMonth as [month, journels]}
	<h2>{month}</h2>
	<div class="list-group">
		{#each journels as [localId, journel]}
			<JournelListItem {localId} {journel} onDelete={createOnDelete(localId, journel)} />
		{/each}
	</div>
{/each}
