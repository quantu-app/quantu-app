<script lang="ts">
	import { afterUpdate, createEventDispatcher } from 'svelte/internal';

	type T = any;

	export let disabled = false;
	export let list: T[];
	export let getId: (item: T) => string = (item) => JSON.stringify(item);
	export let handle: string | undefined = undefined;

	let initted = new Set<string>();
	let listId = Math.random().toString(36).slice(2);
	let dispatch = createEventDispatcher<{ change: T[] }>();
	let target: HTMLElement | undefined;
	let over: number | undefined;

	function getDraggedParent(node?: HTMLElement): DOMStringMap | undefined {
		return node && node.dataset && node.dataset.index
			? node.dataset
			: getDraggedParent(node?.parentNode as HTMLElement);
	}

	function onMouseDown(event: Event) {
		if (disabled) {
			return;
		}
		target = event.target as HTMLElement;
	}
	function onDragStart(event: DragEvent) {
		const eventTarget = event.target as HTMLElement;
		if (eventTarget.contains(target as Node)) {
			event.dataTransfer?.setData('source', eventTarget.dataset.index as string);
		} else {
			event.preventDefault();
		}
	}
	function onDragOver(event: DragEvent) {
		event.preventDefault();
		const dragged = getDraggedParent(event.target as HTMLElement);
		if (dragged && over !== dragged.index) {
			const index = dragged.index;
			if (index) {
				over = +index;
			}
		}
	}
	function onDragLeave(event: DragEvent) {
		const dragged = getDraggedParent(event.target as HTMLElement);
		if (dragged && over === dragged.index) {
			over = undefined;
		}
	}
	function onDrop(event: DragEvent) {
		over = undefined;
		event.preventDefault();
		const dragged = getDraggedParent(event.target as HTMLElement);
		const from = event.dataTransfer?.getData('source');
		const to = dragged?.index;
		if (from && to) {
			reorder(+from, +to);
		}
	}

	$: reorder = (from: number, to: number) => {
		list.splice(to, 0, list.splice(from, 1)[0]);
		list = list;
		dispatch('change', list);
	};

	$: initElement = (element: HTMLElement) => {
		const handleElement = handle ? element.querySelector(handle) : element;
		handleElement?.addEventListener('mousedown', onMouseDown);
		element.setAttribute('draggable', 'true');
		element.addEventListener('dragstart', onDragStart);
		element.addEventListener('dragover', onDragOver);
		element.addEventListener('dragleave', onDragLeave);
		element.addEventListener('drop', onDrop);
	};

	$: getListId = (item: T) => `${listId}-${getId(item)}`;

	afterUpdate(() => {
		const currentIds = new Set<string>();

		list.forEach((item) => {
			const id = getListId(item);

			if (!initted.has(id)) {
				const element = document.querySelector<HTMLElement>(`[data-id="${id}"]`);
				if (element) {
					initElement(element);
					initted.add(id);
				}
			}

			currentIds.add(id);
		});

		for (const id of initted) {
			if (!currentIds.has(id)) {
				initted.delete(id);
			}
		}
	});
</script>

{#if list && list.length}
	{#each list as item, index (getListId(item))}
		<slot id={getListId(item)} {item} {index} over={over === index}>{item}</slot>
	{/each}
{/if}
