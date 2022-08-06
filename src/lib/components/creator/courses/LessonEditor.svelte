<svelte:options immutable />

<script lang="ts">
	import type { StateDepartment } from '$lib/state/creator/departments';
	import type { StateLesson } from '$lib/state/creator/lessons';

	export let department: StateDepartment;
	export let lesson: StateLesson;
</script>

<pre>{JSON.stringify(lesson, null, 2)}</pre>
