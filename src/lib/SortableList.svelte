<script lang="ts">
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';

	export let klass: string;
	export let list: T[];
	export let key: string;
	export let handle: string;

	let prevList: T[] = [...list];

	type T = any;

	let overId: any | false = false;
	function getDraggedParent(node: HTMLElement): HTMLElement | undefined {
		return node.dataset && node.dataset.index
			? node
			: getDraggedParent(node.parentNode as HTMLElement);
	}
	function onStart(e: DragEvent) {
		e.dataTransfer.setData('source', (e.target as HTMLElement).dataset.index);
	}
	function onEnd(e: DragEvent) {
		const dragged = getDraggedParent(e.target as HTMLElement);

		if (dragged) {
			dragged.draggable = false;
		}
	}
	function onOver(e: DragEvent) {
		e.preventDefault();
		const dragged = getDraggedParent(e.target as HTMLElement);
		if (dragged?.dataset.id && overId !== dragged?.dataset.id) {
			overId = JSON.parse(dragged.dataset.id);
		}
	}
	function onLeave(e: DragEvent) {
		const dragged = getDraggedParent(e.target as HTMLElement);
		if (overId === dragged?.dataset.id) {
			overId = false;
		}
	}
	function onDrop(e: DragEvent) {
		overId = false;
		e.preventDefault();
		const dragged = getDraggedParent(e.target as HTMLElement),
			from = parseInt(e.dataTransfer.getData('source')),
			to = parseInt(dragged?.dataset.index);
		reorder(from, to);
	}

	const dispatch = createEventDispatcher<{ sort: T[] }>();
	function reorder(from: number, to: number) {
		const newList = [...list],
			tmp = newList[from];
		newList[from] = newList[to];
		newList[to] = tmp;
		dispatch('sort', newList);
	}

	function getKey(item: T) {
		return key ? item[key] : item;
	}

	function onMouseDown(e: MouseEvent) {
		const dragged = getDraggedParent(e.target as HTMLElement);

		if (dragged) {
			dragged.draggable = true;
		}
	}
	function onMouseUp(e: MouseEvent) {
		const dragged = getDraggedParent(e.target as HTMLElement);

		if (dragged) {
			dragged.draggable = false;
		}
	}

	function initHandle(element: HTMLElement) {
		element.removeEventListener('mousedown', onMouseDown);
		element.addEventListener('mousedown', onMouseDown);
		element.removeEventListener('mouseup', onMouseUp);
		element.addEventListener('mouseup', onMouseUp);
	}

	afterUpdate(() => {
		if (prevList.length !== list.length) {
			prevList = [...list];
			document.querySelectorAll<HTMLElement>(handle).forEach(initHandle);
		}
	});
	onMount(() => {
		document.querySelectorAll<HTMLElement>(handle).forEach(initHandle);
	});
</script>

{#if list && list.length}
	<ul class={klass}>
		{#each list as item, index (getKey(item))}
			<li
				data-index={index}
				data-id={JSON.stringify(getKey(item))}
				on:dragstart={onStart}
				on:dragend={onEnd}
				on:dragover={onOver}
				on:dragleave={onLeave}
				on:drop={onDrop}
				class:over={getKey(item) === overId}
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
