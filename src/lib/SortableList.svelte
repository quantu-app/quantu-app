<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type T = $$Generic;

	let isOver = false;
	const getDraggedParent = (node) =>
		node.dataset && node.dataset.index ? node.dataset : getDraggedParent(node.parentNode);
	const start = (ev) => {
		ev.dataTransfer.setData('source', ev.target.dataset.index);
	};
	const over = (ev) => {
		ev.preventDefault();
		let dragged = getDraggedParent(ev.target);
		if (isOver !== dragged.id) isOver = JSON.parse(dragged.id);
	};
	const leave = (ev) => {
		let dragged = getDraggedParent(ev.target);
		if (isOver === dragged.id) isOver = false;
	};
	const drop = (ev) => {
		isOver = false;
		ev.preventDefault();
		let dragged = getDraggedParent(ev.target);
		let from = ev.dataTransfer.getData('source');
		let to = dragged.index;
		reorder({ from, to });
	};

	const dispatch = createEventDispatcher();
	const reorder = ({ from, to }) => {
		let newList = [...list];
		newList[from] = [newList[to], (newList[to] = newList[from])][0];
		dispatch('sort', newList);
	};

	const getKey = (item: T) => (key ? item[key] : item);

	export let klass: string;
	export let list: T[];
	export let key: string;
</script>

{#if list && list.length}
	<ul class={klass}>
		{#each list as item, index (getKey(item))}
			<li
				data-index={index}
				data-id={JSON.stringify(getKey(item))}
				draggable="true"
				on:dragstart={start}
				on:dragover={over}
				on:dragleave={leave}
				on:drop={drop}
				class:over={getKey(item) === isOver}
			>
				<slot {item} {index}>
					<p>{getKey(item)}</p>
				</slot>
			</li>
		{/each}
	</ul>
{/if}

<style>
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		border: 2px dotted transparent;
		transition: border 0.1s linear;
	}
	.over {
		border-color: rgba(48, 12, 200, 0.2);
	}
</style>
