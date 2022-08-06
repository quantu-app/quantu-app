<svelte:options immutable />

<script lang="ts">
	import type { StateLesson } from '$lib/state/creator/lessons';
	import { setSelected, selected } from './Course.svelte';

	export let lesson: StateLesson;

	function onSelectInternal() {
		setSelected('lesson', lesson.id);
	}
</script>

<li
	class="list-group-item list-group-item-action"
	class:active={$selected === lesson}
	on:click={onSelectInternal}
>
	<div class="d-flex flex-row ps-5">
		<p class="d-flex flex-grow-1 align-self-center m-0 p-0">{lesson.name}</p>
	</div>
</li>
