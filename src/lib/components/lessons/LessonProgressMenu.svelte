<svelte:options immutable />

<script lang="ts">
	type LearningBlockMenuItem = {
		name: string;
		url: string;
		current: boolean;
		completed: boolean;
	};

	export let learningBlockMenuItems: LearningBlockMenuItem[];
</script>

<div class="row">
	{#each learningBlockMenuItems as item (item.url)}
		<!-- svelte-ignore a11y-missing-content -->
		<a
			href={item.url}
			title={item.name}
			class="learningBlock px-3"
			class:pending={!item.completed}
			class:current={item.current}
		/>
	{/each}
</div>

<style>
	.learningBlock {
		display: block;
		width: 40px;
		height: 18px;
		background-color: #333;
		cursor: pointer;
		margin: 0px 2px 2px 0px;
		float: left;
	}
	.learningBlock:hover {
		transform: scaleY(1.3);
		box-shadow: 1px 2px 2px 1px #d0d0d0;
	}
	.learningBlock.pending {
		background-color: #e2e2e2;
	}
	.learningBlock.current {
		background-color: #f9c138;
	}
</style>
