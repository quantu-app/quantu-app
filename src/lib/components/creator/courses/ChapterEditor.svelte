<svelte:options immutable />

<script lang="ts">
	import type { StateChapter } from '$lib/state/creator/chapters';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;
	export let chapter: StateChapter;
</script>

<pre>{JSON.stringify(chapter, null, 2)}</pre>
