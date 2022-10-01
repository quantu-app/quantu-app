<svelte:options immutable />

<script lang="ts">
	type LessonBlockMenuItem = {
		name: string;
		url: string;
		current: boolean;
		completed: boolean;
	};

	export let lessonBlockMenuItems: LessonBlockMenuItem[];
</script>

<div class="row mt-4 d-flex flex-wrap justify-content-center">
	{#each lessonBlockMenuItems as item (item.url)}
		<!-- svelte-ignore a11y-missing-content -->
		<a
			href={item.url}
			title={item.name}
			class="lessonBlock px-3 rounded mb-2"
			class:bg-dark={item.completed && !item.current}
			class:bg-secondary={!item.completed && !item.current}
			class:bg-primary={item.current}
		/>
	{/each}
</div>

<style>
	.lessonBlock {
		display: block;
		width: 48px;
		height: 14px;
		margin: 0px 2px 2px 0px;
		float: left;
	}
</style>
