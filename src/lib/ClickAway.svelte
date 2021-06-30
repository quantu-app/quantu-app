<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	let element: HTMLDivElement;

	const dispatch = createEventDispatcher<{ clickaway: MouseEvent; click: MouseEvent }>();

	function onWindowClick(e: MouseEvent) {
		let targetElement = e.target as Node;

		do {
			if (targetElement === element) {
				dispatch('click', e);
				return;
			}
			targetElement = targetElement.parentNode;
		} while (targetElement);

		dispatch('clickaway', e);
	}

	onMount(() => {
		window.addEventListener('click', onWindowClick);

		return () => {
			window.removeEventListener('click', onWindowClick);
		};
	});
</script>

<div bind:this={element}>
	<slot />
</div>
